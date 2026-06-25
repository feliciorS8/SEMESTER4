import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";

const CATEGORIES = [
  "indonesia",
  "indonesia/politics",
  "indonesia/society",
  "business",
  "business/economy",
  "business/regulations",
  "life/health",
];

export default function Berita() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  const fetchAPI = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const results = await Promise.all(
        CATEGORIES.map(async (category) => {
          const response = await fetch(
            `https://jakpost.vercel.app/api/category/${category}`
          );

          if (!response.ok) {
            return [];
          }

          const json = await response.json();
          return Array.isArray(json.posts) ? json.posts : [];
        })
      );

      const newsPosts = results
        .flat()
        .filter(
          (post, index, allPosts) =>
            index ===
            allPosts.findIndex(
              (item) => (item.link || item.title) === (post.link || post.title)
            )
        );

      if (newsPosts.length === 0) {
        throw new Error("Data berita kosong");
      }

      setPosts(newsPosts);
      setFilteredPosts(newsPosts);
    } catch (error) {
      console.log(error);
      setErrorMessage("Berita gagal dimuat. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredPosts(posts);
      return;
    }

    const keyword = text.trim().toLowerCase();
    const filtered = posts.filter((item) =>
      [item.title, item.description, item.pubDate]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );

    setFilteredPosts(filtered);
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.image || item.thumbnail;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => item.link && Linking.openURL(item.link)}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : null}

        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.date}>{item.pubDate}</Text>

        <Text style={styles.desc}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAPI}>
          <Text style={styles.retryText}>Coba lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredPosts}
      style={styles.container}
      keyExtractor={(item, index) => `${item.link || item.title || "post"}-${index}`}
      renderItem={renderItem}
      ListHeaderComponent={
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berita di sini..."
          value={searchText}
          onChangeText={handleSearch}
        />
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>Berita tidak ditemukan.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
  },

  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  date: {
    color: "gray",
    marginBottom: 5,
  },

  desc: {
    fontSize: 14,
  },

  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  messageText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },

  emptyText: {
    color: "gray",
    textAlign: "center",
    marginTop: 24,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
