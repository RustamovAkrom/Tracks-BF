from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.musics.models import Artist, Album, Track

User = get_user_model()


class ArtistAPITestCase(APITestCase):
    def setUp(self):
        # Создаём суперпользователя для CRUD
        self.admin = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="adminpass"
        )
        # Публичный артист
        self.artist = Artist.objects.create(name="Test Artist")
        # Альбом и трек для детального теста
        self.album = Album.objects.create(name="Test Album", artist=self.artist, owner=self.admin)
        self.track = Track.objects.create(
            owner=self.admin,
            name="Test Track",
            album=self.album,
            artist=self.artist,
            duration=180,
        )

        # URL
        self.list_url = reverse("artist-list")  # /artists/
        self.detail_url = reverse(
            "artist-detail", args=[self.artist.slug]
        )  # /artists/<slug>/

    # ---------------- LIST ----------------
    def test_artist_list_anon(self):
        """Тестируем получение списка артистов анонимным пользователем"""

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("name", response.data[0])

    def test_artist_list_search(self):
        """Тестируем поиск артистов"""

        response = self.client.get(self.list_url, {"search": "Test"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    # ---------------- RETRIEVE ----------------
    def test_artist_retrieve(self):
        """Тестируем получение детальной информации об артисте"""

        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], self.artist.name)
        self.assertIn("albums", response.data)
        self.assertEqual(len(response.data["albums"]), 1)
        self.assertEqual(response.data["albums"][0]["tracks"][0]["name"], "Test Track")

    # ---------------- CREATE ----------------
    def test_artist_create_admin(self):
        """Тестируем создание артиста админом"""

        self.client.force_authenticate(user=self.admin)
        data = {"name": "New Artist"}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Artist.objects.count(), 2)

    def test_artist_create_anon(self):
        """Тестируем создание артиста анонимом (должно быть запрещено)"""

        data = {"name": "New Artist"}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ---------------- UPDATE ----------------
    def test_artist_update_admin(self):
        """Тестируем полное обновление артиста админом"""

        self.client.force_authenticate(user=self.admin)
        data = {"name": "Updated Artist"}
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.artist.refresh_from_db()
        self.assertEqual(self.artist.name, "Updated Artist")

    def test_artist_partial_update_admin(self):
        """Тестируем частичное обновление артиста админом"""

        self.client.force_authenticate(user=self.admin)
        data = {"bio": "New bio"}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.artist.refresh_from_db()
        self.assertEqual(self.artist.bio, "New bio")

    def test_artist_update_anon(self):
        """Тестируем обновление артиста анонимом (должно быть запрещено)"""

        data = {"name": "Hacker Artist"}
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ---------------- DELETE ----------------
    def test_artist_delete_admin(self):
        """Тестируем удаление артиста админом"""

        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Artist.objects.filter(id=self.artist.id).exists())

    def test_artist_delete_anon(self):
        """Тестируем удаление артиста анонимом (должно быть запрещено)"""

        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
