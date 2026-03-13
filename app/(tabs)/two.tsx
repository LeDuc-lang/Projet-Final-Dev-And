import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View as RNView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

type StoredEntry = any

export default function TabTwoScreen() {
  const [entries, setEntries] = useState<StoredEntry[]>([])
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('@dreams:entries')
      const parsed = raw ? JSON.parse(raw) : []
      setEntries(parsed)
    } catch (e) {
      console.error('Failed to load entries', e)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }, [load])

  async function deleteEntry(id: number) {
    try {
      const raw = await AsyncStorage.getItem('@dreams:entries')
      const parsed = raw ? JSON.parse(raw) : []

      const next = parsed.filter((e: any) => e.id !== id)

      await AsyncStorage.setItem('@dreams:entries', JSON.stringify(next))
      setEntries(next)

    } catch (e) {
      console.error(e)
    }
  }
  function editEntry(id: number) {
    // navigate to index with editId param
    router.push(`/?editId=${id}`)
  }

  // Prépare les options si besoin plus tard (garde la logique)
  const types = useMemo(() => Array.from(new Set(entries.map(e => e.type).filter(Boolean))), [entries])
  const tones = useMemo(() => Array.from(new Set(entries.map(e => e.tone).filter(Boolean))), [entries])
  const characters = useMemo(() => Array.from(new Set(entries.flatMap(e => e.characters ?? []).filter(Boolean))), [entries])

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter(e => {
      if (selectedType && e.type !== selectedType) return false
      if (selectedTone && e.tone !== selectedTone) return false
      if (selectedCharacter && !(e.characters ?? []).includes(selectedCharacter)) return false
      if (!q) return true
      const hay = `${e.meaning ?? ''} ${e.type ?? ''} ${e.tone ?? ''} ${(e.characters ?? []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [entries, query, selectedType, selectedTone, selectedCharacter])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrées de rêves</Text>

      <TextInput
        placeholder="Rechercher par mot-clé, type, émotion, personnage..."
        value={query}
        onChangeText={setQuery}
        style={{ padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8 }}
      />

      <FlatList
        data={filteredEntries}
        keyExtractor={item => String(item.id ?? item._id ?? Math.random())}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.type ?? '—'} — {item.tone ?? '—'}</Text>
            <Text>{item.date ? new Date(item.date).toLocaleString() : 'Date non renseignée'}</Text>
            <Text numberOfLines={2}>{item.meaning ?? ''}</Text>
            <RNView style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity onPress={() => editEntry(item.id)} style={{ marginRight: 12 }}>
                <Text style={{ color: '#007AFF' }}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                <Text style={{ color: '#FF3B30' }}>Supprimer</Text>
              </TouchableOpacity>
            </RNView>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<View style={{ padding: 20 }}><Text>Aucune entrée trouvée.</Text></View>}
      />

      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  separator: {
    marginVertical: 8,
    height: 1,
    width: '100%',
  },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemTitle: { fontWeight: '700' },
});
