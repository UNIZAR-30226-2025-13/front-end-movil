import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
    FlatList,
    Dimensions,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { saveData, getData, removeData } from "../utils/storage";
import { fetchAndSaveLibrary } from "../utils/fetch";

const screenWidth = Dimensions.get('window').width;




interface CreatePlaylistLista {
    id_lista: number;
    nombre: string;
}
const username = getData("username");
useEffect(() => { 
        const loadUser = async () => {
            const username = await getData("username");
            console.log(username);
        };
        loadUser();
    }, []);
export default function CreatePlaylistScreen() {
    
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('Canciones');
    const [playlistName, setplaylistName] = useState<string>("");
    const tabs = ['Canciones', 'Episodios'];

    const [listas, setListas] = useState<CreatePlaylistLista[]>([]);


    const handleGuardar = async (
        nombreUsuario: string,
        tipo: "canciones" | "episodios"
    ) => {
    
    try {
        const url = `https://spongefy-back-end.onrender.com/create-list`;

        const bodyData = {
            nombre_usuario: nombreUsuario,
            nombre_lista: playlistName,
            color: selectedColor,
            tipo: tipo,
        };

        const response = await fetch(url, {
            method: "POST", // Cambiado a POST
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            console.log("Playlist creada exitosamente:", data);
            router.push("/Biblioteca");
        } else {
            console.error("Error al crear la playlist:", data);
        }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }

    };
    const [selectedColor, setSelectedColor] = useState<string>("");
    interface ColorDropdownProps {
        selectedColor: string | null;
        setSelectedColor: (color: string) => void;
    }
    
    const ColorDropdown: React.FC<ColorDropdownProps> = ({ selectedColor, setSelectedColor }) => {
    
        const colors = [
            { name: "Rojo", value: "#FF0000" },
            { name: "Azul", value: "#0000FF" },
            { name: "Verde", value: "#008000" },
            { name: "Amarillo", value: "#FFFF00" },
        ];
        return (
            <View style={styles.colorDropdownContainer}>
                <Text style={styles.label}>Selecciona un color:</Text>
                <View style={styles.colorPicker}>
                    {colors.map((color) => (
                        <TouchableOpacity
                            key={color.value}
                            style={[styles.colorBox, { backgroundColor: color.value }]}
                            onPress={() => setSelectedColor(color.value)}
                        />
                    ))}
                </View>
                {selectedColor && (
                    <View style={styles.selectedColorContainer}>
                        <Text style={styles.selectedColorText}>
                            Color seleccionado:
                        </Text>
                        <View style={[styles.selectedColorCircle, { backgroundColor: selectedColor }]} />
                    </View>
                )}
            </View>
        );
    };
    const renderSectionContent = () => {
        switch (selectedTab) {
            case 'Canciones':
                return (
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la Playlist"
                            placeholderTextColor="#888"
                            onChangeText={setplaylistName}
                        />
                        <ColorDropdown selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                        
                        <TouchableOpacity style={styles.addButton} onPress={async () => {const username = await getData("username"); handleGuardar( username, "canciones")}}>
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                );
            case 'Episodios':
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView style={styles.scrollView}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de la Playlist"
                                placeholderTextColor="#888"
                                onChangeText={setplaylistName}
                            />
                            <ColorDropdown selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                            
                        </ScrollView>
                        <TouchableOpacity style={styles.addButton} onPress={async () => {const username = await getData("username"); handleGuardar( username, "episodios")}}>
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                ); 
            default:
                return <Text style={styles.sectionText}>Selecciona una sección</Text>;
        }
    };

    const handleBiblioteca = () => {
        router.push('/Biblioteca');
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Ionicons name="library-outline" size={28} color="white" />
                <Text style={styles.title}>Crea una Playlist</Text>
            </View>

        {/* Tabs de navegación */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, selectedTab === tab && styles.tabSelected]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && styles.tabTextSelected]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.content}>
                {renderSectionContent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    input: {
        width: "100%",
        backgroundColor: "#ddd",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        textAlign: "center",
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Barre de recherche
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderColor: '#9400D3',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
        marginHorizontal: 16,
        marginBottom: 10,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    // Tabs de navigation
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    tab: {
        backgroundColor: '#333',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 10,
    },
    tabSelected: {
        backgroundColor: '#fff',
    },
    tabText: {
        color: '#fff',
        fontSize: 14,
    },
    tabTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    // Contenu
    content: {
        flex: 1,
        marginHorizontal: 16,
    },
    sectionText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
    },
    // Liste d'artistes ou chansons
    artistasContainer: {
        marginTop: 10,
    },
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    artistAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        resizeMode: 'cover',
    },
    artistName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Barre de navigation inférieure
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#111',
        paddingVertical: 8,
    },
    bottomBarItem: {
        alignItems: 'center',
    },
    bottomBarText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 2,
    },
    // Styles pour les playlists dans l'onglet "Listas"
    playlistItem: {
        backgroundColor: "#222",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
    },
    playlistText: {
        color: "#fff",
        fontSize: 16,
    },
    favItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9400D3', // Violet
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    favItemText: {
        color: '#fff',
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'purple',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    podcastItem: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    podcastImage: {
        width: 80, 
        height: 80,
        borderRadius: 25, 
        marginRight: 15, 
    },
    podcastText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    colorDropdownContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    colorPicker: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },
    colorBox: {
        width: 40,
        height: 40,
        margin: 5,
        borderRadius: 20, // Hace que sea un círculo
        borderWidth: 2,
        borderColor: "#ddd",
    },
    selectedColorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    selectedColorText: {
        fontSize: 16,
        marginRight: 10,
    },
    selectedColorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15, // Círculo pequeño para mostrar el color seleccionado
        borderWidth: 2,
        borderColor: "#000",
    },
});
