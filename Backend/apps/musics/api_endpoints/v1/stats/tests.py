from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.musics.models import Track, Like, ListeningHistory, Artist

User = get_user_model()


class StatsAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="user", email="user@example.com", password="pass123"
        )
        self.other_user = User.objects.create_user(
            username="other", email="other@example.com", password="pass123"
        )

        # Треки
        self.artist = Artist.objects.create(name="Artist 1")
        self.track1 = Track.objects.create(
            owner=self.user, name="Track 1", artist=self.artist, duration=120
        )
        self.track2 = Track.objects.create(
            owner=self.other_user, name="Track 2", artist=self.artist, duration=150
        )

        # URL-эндпоинты
        self.likes_url = reverse("like-list")  # /likes/
        self.history_url = reverse("history-list")  # /listening-history/

        # Создадим начальные лайки и историю
        Like.objects.create(user=self.user, track=self.track1)
        ListeningHistory.objects.create(user=self.user, track=self.track2, duration=60)

    # ---------------- Likes ----------------
    def test_like_list_auth(self):
        """Тестируем получение списка лайков аутентифицированным пользователем"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.likes_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["track_name"], self.track1.name)

    def test_like_list_anon(self):
        """Тестируем получение списка лайков анонимным пользователем"""
        response = self.client.get(self.likes_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_like_create_auth(self):
        """Тестируем создание лайка аутентифицированным пользователем"""
        self.client.force_authenticate(user=self.user)
        data = {"track": self.track2.id}
        response = self.client.post(self.likes_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Like.objects.filter(user=self.user, track=self.track2).exists())

    def test_like_create_anon(self):
        """Тестируем создание лайка анонимным пользователем"""
        data = {"track": self.track2.id}
        response = self.client.post(self.likes_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ---------------- Listening History ----------------
    def test_history_list_auth(self):
        """Тестируем получение списка истории прослушиваний аутентифицированным пользователем"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["track_name"], self.track2.name)

    def test_history_list_anon(self):
        """Тестируем получение списка истории прослушиваний анонимным пользователем"""
        response = self.client.get(self.history_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_history_create_auth(self):
        """Тестируем создание записи в истории прослушиваний аутентифицированным пользователем"""
        self.client.force_authenticate(user=self.user)
        data = {"track": self.track1.id, "duration": 90}
        response = self.client.post(self.history_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            ListeningHistory.objects.filter(user=self.user, track=self.track1).exists()
        )

    def test_history_create_anon(self):
        """Тестируем создание записи в истории прослушиваний анонимным пользователем"""
        data = {"track": self.track1.id, "duration": 90}
        response = self.client.post(self.history_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
