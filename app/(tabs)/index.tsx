import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const stylesList = ["Cartoon", "Anime", "Sketch", "Pixel", "Flat"];

  // 📤 PICK IMAGE
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setGeneratedImages([]);
    }
  };

  // ⚡ GENERATE MOCK
  const generateAll = async () => {
    if (!image) return;

    setLoading(true);

    setTimeout(() => {
      const results = stylesList.map(
        () => "https://picsum.photos/300?random=" + Math.random()
      );
      setGeneratedImages(results);
      setLoading(false);
    }, 2000);
  };

  // 📤 SHARE (WORKING)
  const shareImage = async (uri: string) => {
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        alert("Sharing not supported");
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Clipart Generator 🎨</Text>

      {/* Upload */}
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.uploadText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Original */}
      {image && (
        <>
          <Text style={styles.sectionTitle}>Original</Text>
          <Image source={{ uri: image }} style={styles.image} />
        </>
      )}

      {/* Generate */}
      {image && (
        <TouchableOpacity style={styles.generateBtn} onPress={generateAll}>
          <Text style={styles.generateText}>Generate Styles ⚡</Text>
        </TouchableOpacity>
      )}

      {/* Loading */}
      {loading && (
        <>
          <Text style={styles.loadingText}>Generating AI styles...</Text>
          <View style={styles.grid}>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <View key={i} style={styles.skeleton} />
            ))}
          </View>
        </>
      )}

      {/* Grid */}
      {!loading && (
        <View style={styles.grid}>
          {generatedImages.map((img, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: img }} style={styles.gridImage} />

              <Text style={styles.styleLabel}>
                {stylesList[index]}
              </Text>

              <TouchableOpacity
                onPress={() => shareImage(img)}
                style={styles.shareBtn}
              >
                <Text style={styles.btnText}>📤 Share</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
  },
  generateBtn: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
  },
  generateText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    marginTop: 15,
    fontWeight: "600",
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    margin: 5,
    elevation: 3,
    alignItems: "center",
  },
  gridImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  skeleton: {
    width: 140,
    height: 140,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  styleLabel: {
    marginTop: 5,
    fontWeight: "600",
  },
  shareBtn: {
    marginTop: 5,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
  },
});

