import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { database } from "./firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{ id: string; task: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const taskDocument = collection(database, "tasks");

  useEffect(() => {
    const unsubscribe = onSnapshot(taskDocument, (snapshot) => {
      const loadedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        task: doc.data().task,
      }));
      setTasks(loadedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (task.trim() == "") {
      Alert.alert("Error", "Task is empty");
      return;
    }
    setLoading(true);
    try {
      await addDoc(taskDocument, {
        task: task,
      });
      setTask("");
    } catch (e) {
      Alert.alert("Error", "Error adding document");
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(database, "tasks", id));
    } catch (e) {
      Alert.alert("Error", "Failed to delete the task.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Todo list</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          value={task}
          onChangeText={setTask}
        />
        <Button title="Add Task" onPress={addTask} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <Text style={styles.task}>{item.task}</Text>
              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  task: {
    padding: 10,
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
