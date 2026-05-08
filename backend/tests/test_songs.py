def test_get_songs_returns_200(client):
    response = client.get("/api/songs")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "data" in data
    assert data["total"] == 3
    assert data["page"] == 1


def test_get_songs_pagination_limit(client):
    response = client.get("/api/songs?page=1&limit=5")
    assert response.status_code == 200
    data = response.json()
    # Only 3 songs in test data, so at most 3 returned even with limit=5
    assert len(data["data"]) <= 5
    assert data["limit"] == 5


def test_search_by_title_found(client):
    response = client.get("/api/songs/search?title=3AM")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert any("3AM" in song["title"] for song in results)


def test_search_by_title_not_found(client):
    response = client.get("/api/songs/search?title=nonexistent")
    assert response.status_code == 200
    results = response.json()
    assert results == []


def test_update_rating_valid(client):
    response = client.put("/api/songs/0/rating", json={"rating": 4})
    assert response.status_code == 200
    data = response.json()
    assert data["star_rating"] == 4
    assert data["index"] == 0


def test_update_rating_invalid_too_high(client):
    response = client.put("/api/songs/0/rating", json={"rating": 6})
    assert response.status_code == 422


def test_get_all_songs(client):
    response = client.get("/api/songs/all")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3
