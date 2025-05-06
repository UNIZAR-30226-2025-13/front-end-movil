import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { chatService } from './chatService';
import { getData } from '../utils/storage';
import { fetchAndSaveMessages } from '@/utils/fetch';

export default function ChatScreen() {
    const router = useRouter();
    const [friendName, setFriendName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const loadData = async () => {
            const nombre = await getData("username");
            setUsername(nombre);
    
            const nombre_amigo = await getData("user_chat");
            setFriendName(nombre_amigo);
    
            await fetchAndSaveMessages(nombre, nombre_amigo);
            const datosMensajes = await getData("messages");
    
            if (datosMensajes) {
                setMessages(datosMensajes || []);
            }
        };
    
        // Recibir nuevos mensajes
        chatService.onNewMessage((message) => {
            setMessages(prev => [{
                id_mensaje: Date.now(),
                nombre_usuario_envia: message.from,
                nombre_usuario_recibe: message.to,
                contenido: message.content,
                fecha: new Date().toISOString()
            }, ...prev]);
        });
    
        // Escuchar cuando un mensaje sea eliminado
        chatService.onMessageDeleted((data) => {
            setMessages(prev => prev.filter(msg => msg.id_mensaje !== data.id_mensaje));
        });
    
        loadData();
    
        // Limpiar eventos al desmontar
        return () => {
            chatService.offEvents();
        };
    }, []);

    const handleSend = async () => {
        if (inputText.trim() !== '' && username && friendName) {
            const messageContent = inputText.trim();
    
            
            chatService.sendMessage(username, friendName, messageContent);
    
            // guardar localmente en el estado
            setMessages(prev => [{
                id_mensaje: Date.now(),
                nombre_usuario_envia: username,
                nombre_usuario_recibe: friendName,
                contenido: messageContent,
                fecha: new Date().toISOString()
            }, ...prev]);
    
            setInputText('');

            //asi se haria si decidiesemos usar la funcion de la api en vez de websockets
            // try {
            //     const response = await fetch('https://spongefy-back-end.onrender.com/send-message', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             nombre_usuario_envia: username,
            //             nombre_usuario_recibe: friendName,
            //             mensaje: messageContent
            //         })
            //     });
    
            //     if (!response.ok) {
            //         const errorData = await response.json();
            //         console.error('Error al enviar mensaje:', errorData.message);
            //     } else {
            //         const data = await response.json();
            //         console.log('Mensaje enviado correctamente:', data.message);
            //     }
            // } catch (error) {
            //     console.error('Error en la solicitud de envío de mensaje:', error);
            // }
        }
    };

    const handleDeleteMessage = (id_mensaje: number) => {
       
        setMessages(prev => prev.filter(msg => msg.id_mensaje !== id_mensaje));
        chatService.deleteMessage(id_mensaje);
    };

    // const renderItem = ({ item }: { item: any }) => {
    //     const isMyMessage = item.nombre_usuario_envia === username;
    //     const hora = new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    //     return (
    //         <View style={[styles.bubble, isMyMessage ? styles.bubbleRight : styles.bubbleLeft]}>
    //             <Text style={styles.messageText}>{item.contenido}</Text>
    //             {/* por si queremos mostrar la hora de envio */}
    //             {/* <Text style={styles.timeText}>{hora}</Text> */}
    //         </View>
    //     );
    // };

    const alertConfirmDelete = (id_mensaje: number) => {
        Alert.alert(
            "Eliminar mensaje",
            "¿Quieres eliminar este mensaje?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDeleteMessage(id_mensaje),
                    style: "destructive"
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isMyMessage = item.nombre_usuario_envia === username;
        const hora = new Date(item.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
        const onPressMessage = () => {
            if (isMyMessage) {
                // Solo puedes borrar tus propios mensajes
                // Confirmación rápida con alert
                alertConfirmDelete(item.id_mensaje);
            }
        };
    
        return (
            <TouchableOpacity
                onPress={onPressMessage}
                activeOpacity={isMyMessage ? 0.7 : 1}
            >
                <View style={[styles.bubble, isMyMessage ? styles.bubbleRight : styles.bubbleLeft]}>
                    <Text style={styles.messageText}>{item.contenido}</Text>
                    {/* <Text style={styles.timeText}>{hora}</Text> */}
                </View>
            </TouchableOpacity>
        );
    };

    const goToFriends = () => {
        router.push('/baseLayoutPages/Friends');
      };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goToFriends} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{friendName || 'Amigo'}</Text>
                <View style={{ width: 32 }} /> 
            </View>

            {/* Mensajes */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_mensaje.toString()}
                inverted
                contentContainerStyle={styles.messagesContainer}
            />

            {/* Input */}
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#9400D3',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    backButton: {
        padding: 4
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 10,
        paddingTop: 0,
        flexGrow: 1
    },
    bubble: {
        borderRadius: 16,
        marginBottom: 8,
        padding: 10,
        maxWidth: '75%'
    },
    bubbleLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#4B2E83'
    },
    bubbleRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#9400D3'
    },
    messageText: {
        color: '#fff',
        fontSize: 16
    },
    timeText: {
        color: '#ccc',
        fontSize: 10,
        textAlign: 'right',
        marginTop: 4
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        margin: 3,
        borderRadius: 20,
        paddingHorizontal: 12
    },
    input: {
        flex: 1,
        color: '#fff',
        height: 50
    },
    sendButton: {
        padding: 8
    }
});
