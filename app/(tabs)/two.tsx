import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

type StoredEntry = any

export default function TabTwoScreen() {
  const [entries, setEntries] = useState<StoredEntry[]>([])
  const [refreshing, setRefreshing] = useState(false)

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrées de rêves</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <FlatList
        data={entries}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.type ?? '—'} — {item.tone ?? '—'}</Text>
            <Text>{item.date ? new Date(item.date).toLocaleString() : 'Date non renseignée'}</Text>
            <Text numberOfLines={2}>{item.meaning ?? ''}</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<View style={{ padding: 20 }}><Text>Aucune entrée trouvée.</Text></View>}
      />

      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
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
