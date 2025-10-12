from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.musics.models import Album, Artist

User = get_user_model()


class AlbumAPITestCase(APITestCase):
    def setUp(self):
        # Создаем пользователя и авторизуемся
        self.user = User.objects.create_user(
            username="testuser", email="testuser@example.com", password="password123"
        )
        self.client.force_authenticate(user=self.user)

        # Создаем артиста
        self.artist = Artist.objects.create(name="Test Artist", owner=self.user)

        # Создаем альбомы
        self.album1 = Album.objects.create(
            name="Album One", artist=self.artist, is_published=True, owner=self.user
        )
        self.album2 = Album.objects.create(
            name="Album Two", artist=self.artist, is_published=False, owner=self.user
        )

    def test_list_albums(self):
        """Тестируем получение списка альбомов"""

        url = reverse("album-list")  # /musics/albums/
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Проверяем, что видим только опубликованные
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Album One")

    def test_retrieve_album(self):
        """Тестируем получение детальной информации об альбоме"""

        url = reverse("album-detail", args=[self.album1.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Album One")

    def test_create_album(self):
        """Тестируем создание нового альбома"""

        url = reverse("album-list")
        data = {"name": "New Album", "artist": self.artist.id, "is_published": True}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Album.objects.count(), 3)
        self.assertEqual(Album.objects.get(name="New Album").artist, self.artist)

    def test_update_album(self):
        """Тестируем обновление информации об альбоме"""

        url = reverse("album-detail", args=[self.album1.slug])
        data = {"name": "Updated Album"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.album1.refresh_from_db()
        self.assertEqual(self.album1.name, "Updated Album")

    def test_delete_album(self):
        """Тестируем удаление альбома"""

        url = reverse("album-detail", args=[self.album1.slug])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Album.objects.filter(slug=self.album1.slug).exists())
