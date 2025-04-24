// app/FriendsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Pressable, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getData } from '../../utils/storage';
import { fetchAndSaveFriendsList } from '@/utils/fetch';
import { goToPerfil, goToChat } from '../../utils/navigation';

export default function FriendsScreen() {
    const router = useRouter();
    const [friends, setFriends] = useState<string[]>([]);
    const [userName, setUserName] = useState<string | null>(null);


    useEffect(() => {
        const loadFriends = async () => {
          const nombre_usuario = await getData("username");
          await fetchAndSaveFriendsList(nombre_usuario);
          
          const data = await getData("friendlist");
      
          if (data && Array.isArray(data.amigos)) {
            setFriends(data.amigos);
          } else {
            console.warn("La lista de amigos no es un array:", data);
            setFriends([]);
          }
        };
      
        loadFriends();
      }, []);

    const handleUserPress = (username: string) => {
        console.log('Usuario pulsado:', username);
        goToPerfil(username);
      };
    
      const handleChatPress = (username: string) => {
        console.log('Chat con:', username);
        goToChat(username);
      };

    // const renderItem = ({ item }: { item: string }) => (
    //     <View style={styles.row}>
    //         <TouchableOpacity
    //             onPress={() => router.push(`./amigo/${item}`)}
    //         >
    //             <Text style={styles.username}>{item}</Text>
    //         </TouchableOpacity>

    //         <TouchableOpacity style={styles.chatButton}>
    //             <Ionicons name="chatbubble-outline" size={24} color="#fff" />
    //         </TouchableOpacity>
    //     </View>
    // );

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Tus amigos</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
        {friends.map((friend, index) => (
          <View key={index} style={styles.friendRow}>
            <TouchableOpacity onPress={() => handleUserPress(friend)} style={styles.userSection}>
              <Text style={styles.friendName}>{friend}</Text>
            </TouchableOpacity>
            <Pressable onPress={() => handleChatPress(friend)}>
              <View style={styles.chatIconContainer}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              </View>
            </Pressable>
          </View>
        ))}
      </ScrollView>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    title: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    scrollContainer: {
      paddingBottom: 20,
    },
    friendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#111',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 10,
      justifyContent: 'space-between',
    },
    userSection: {
      flex: 1,
    },
    friendName: {
      color: '#fff',
      fontSize: 16,
    },
    chatIconContainer: {
      backgroundColor: '#8446cf',
      borderRadius: 20,
      padding: 8,
    },
    chatIcon: {
      width: 20,
      height: 20,
      tintColor: '#fff',
    },
  });
  