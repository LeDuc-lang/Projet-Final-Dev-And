import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, View as RNView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

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
    router.push({ pathname: '/(tabs)/Dreams', params: { editId: String(id) } })
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <RNView style={styles.hero}>
        <RNView style={styles.heroGlowA} />
        <RNView style={styles.heroGlowB} />
        <Text style={styles.heroKicker}>Bibliotheque onirique</Text>
        <Text style={styles.heroTitle}>Tes reves, mieux lisibles</Text>
        <Text style={styles.heroSubtitle}>Filtre, recherche et relis les details d'un coup d'oeil.</Text>
      </RNView>

      <RNView style={styles.card}>
        <Text style={styles.sectionTitle}>Recherche</Text>
        <TextInput
          placeholder="Rechercher par mot-cle, type, emotion, personnage..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </RNView>

      <RNView style={styles.listContent}>
        {filteredEntries.length === 0 ? (
          <RNView style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aucune entree trouvee</Text>
            <Text style={styles.emptySubtitle}>Ajoute un reve ou ajuste tes filtres.</Text>
          </RNView>
        ) : (
          filteredEntries.map((item) => (
            <RNView key={String(item.id ?? item._id ?? Math.random())} style={styles.entryCard}>
              <RNView style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{item.type ?? '—'}</Text>
                <Text style={styles.entryTone}>{item.tone ?? '—'}</Text>
              </RNView>
              <Text style={styles.entryDate}>{item.date ? new Date(item.date).toLocaleString() : 'Date non renseignee'}</Text>

              {item.place ? (
                <Text style={styles.entryLine}><Text style={styles.entryLabel}>Lieu: </Text>{item.place}</Text>
              ) : null}
              {item.meaning ? (
                <Text style={styles.entryLine}><Text style={styles.entryLabel}>Signification: </Text>{item.meaning}</Text>
              ) : null}

              <RNView style={styles.metricsRow}>
                <RNView style={styles.metricPill}>
                  <Text style={styles.metricLabel}>Avant</Text>
                  <Text style={styles.metricValue}>{item.emotionBefore ?? '—'}</Text>
                </RNView>
                <RNView style={styles.metricPill}>
                  <Text style={styles.metricLabel}>Apres</Text>
                  <Text style={styles.metricValue}>{item.emotionAfter ?? '—'}</Text>
                </RNView>
                <RNView style={styles.metricPill}>
                  <Text style={styles.metricLabel}>Intensite</Text>
                  <Text style={styles.metricValue}>{item.intensity ?? '—'}</Text>
                </RNView>
                <RNView style={styles.metricPill}>
                  <Text style={styles.metricLabel}>Clarte</Text>
                  <Text style={styles.metricValue}>{item.clarity ?? '—'}</Text>
                </RNView>
              </RNView>

              {Array.isArray(item.characters) && item.characters.length > 0 ? (
                <RNView style={styles.tagsRow}>
                  {item.characters.map((c: string, idx: number) => (
                    <RNView key={`${c}-${idx}`} style={styles.tagChip}>
                      <Text style={styles.tagText}>{c}</Text>
                    </RNView>
                  ))}
                </RNView>
              ) : null}

              {Array.isArray(item.tags) && item.tags.length > 0 ? (
                <RNView style={styles.tagsRow}>
                  {item.tags.map((t: string, idx: number) => (
                    <RNView key={`${t}-${idx}`} style={styles.tagChipAlt}>
                      <Text style={styles.tagTextAlt}>{t}</Text>
                    </RNView>
                  ))}
                </RNView>
              ) : null}

              <RNView style={styles.actionsRow}>
                <TouchableOpacity onPress={() => editEntry(item.id)} style={styles.actionPrimary}>
                  <Text style={styles.actionPrimaryText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteEntry(item.id)} style={styles.actionGhost}>
                  <Text style={styles.actionGhostText}>Supprimer</Text>
                </TouchableOpacity>
              </RNView>
            </RNView>
          ))
        )}
      </RNView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#0B1220',
  },
  containerContent: {
    paddingBottom: 24,
  },
  hero: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#111827',
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroGlowA: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: '#22D3EE',
    opacity: 0.3,
    top: -80,
    left: -70,
  },
  heroGlowB: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: '#A855F7',
    opacity: 0.25,
    bottom: -120,
    right: -60,
  },
  heroKicker: {
    color: '#A5B4FC',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#C7D2FE',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#CBD5F5',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    color: '#0F172A',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#4F46E5',
  },
  chipActiveAlt: {
    backgroundColor: '#0EA5E9',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#312E81',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 8,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  entryTone: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    textTransform: 'uppercase',
  },
  entryDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  entryLine: {
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 6,
  },
  entryLabel: {
    fontWeight: '700',
    color: '#334155',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  metricPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagChip: {
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipAlt: {
    backgroundColor: '#E0F2FE',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  tagTextAlt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionPrimary: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionGhost: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionGhostText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 16,
  },
  emptySubtitle: {
    color: '#CBD5F5',
    marginTop: 6,
  },
});
