import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, TouchableOpacity } from 'react-native'
import { TamaguiProvider, Text, YStack } from 'tamagui'
import DreamInputs, { SleepQuality, Tone } from '../../components/DreamInputs.native'
import config from '../../tamagi.config'

export default function App() {
  const [date, setDate] = useState<Date | null>(null)
  const [type, setType] = useState<string>('ordinaire')
  const [before, setBefore] = useState<number>(5)
  const [after, setAfter] = useState<number>(5)
  const [characters, setCharacters] = useState<string[]>([])
  const [place, setPlace] = useState<string>('')
  const [intensity, setIntensity] = useState<number>(5)
  const [clarity, setClarity] = useState<number>(5)
  const [tags, setTags] = useState<string[]>([])
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('moyenne')
  const [meaning, setMeaning] = useState<string>('')
  const [tone, setTone] = useState<Tone>('neutre')
  const [editingId, setEditingId] = useState<number | null>(null)
  const router = useRouter()
  const params = useLocalSearchParams()
  const editId = (params as { editId?: string }).editId

  useEffect(() => {
    if (!editId) return
    // avoid re-loading if already editing the same id
    if (editingId && String(editingId) === String(editId)) return

    let mounted = true
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem('@dreams:entries')
        const parsed = raw ? JSON.parse(raw) : []
        const found = parsed.find((e: any) => String(e.id) === String(editId))
        if (!mounted) return
        if (found) {
          setEditingId(found.id)
          setDate(found.date ? new Date(found.date) : null)
          setType(found.type ?? 'ordinaire')
          setBefore(found.emotionBefore ?? 5)
          setAfter(found.emotionAfter ?? 5)
          setCharacters(found.characters ?? [])
          setPlace(found.place ?? '')
          setIntensity(found.intensity ?? 5)
          setClarity(found.clarity ?? 5)
          setTags(found.tags ?? [])
          setSleepQuality(found.sleepQuality ?? 'moyenne')
          setMeaning(found.meaning ?? '')
          setTone(found.tone ?? 'neutre')
        }
      } catch (e) {
        console.error('Failed to load editing entry', e)
      }
    })()

    return () => {
      mounted = false
    }
  }, [editId])

  const handleSubmit = () => {
    const base = {
      date: date ? date.toISOString() : null,
      type,
      emotionBefore: before,
      emotionAfter: after,
      characters,
      place,
      intensity,
      clarity,
      tags,
      sleepQuality,
      meaning,
      tone,
    }

    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem('@dreams:entries')
        const existing = raw ? JSON.parse(raw) : []
        let next
        if (editingId) {
          // find by id string equality to be robust
          const idx = existing.findIndex((e: any) => String(e.id) === String(editingId))
          if (idx !== -1) {
            // replace in place
            existing[idx] = { ...existing[idx], ...base, id: editingId }
            next = existing
          } else {
            // if not found, prepend updated entry with same id
            next = [{ id: editingId, ...base }, ...existing]
          }
        } else {
          const id = Date.now()
          next = [{ id, ...base }, ...existing]
        }
        await AsyncStorage.setItem('@dreams:entries', JSON.stringify(next))
        Alert.alert('Enregistré', editingId ? 'Rêve modifié' : 'Entrée de rêve enregistrée')
        setEditingId(null)
        // clear form
        setDate(null)
        setType('ordinaire')
        setBefore(5)
        setAfter(5)
        setCharacters([])
        setPlace('')
        setIntensity(5)
        setClarity(5)
        setTags([])
        setSleepQuality('moyenne')
        setMeaning('')
        setTone('neutre')
        // remove editId param if any
        try { router.replace('/') } catch (e) { /* ignore */ }
      } catch (e) {
        console.error(e)
        Alert.alert('Erreur', 'Impossible de sauvegarder')
      }
    })()
  }

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <Text fontSize="$8" fontWeight="bold" marginBottom="$3">Journal de rêve</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <YStack width={400} maxWidth="100%">
            <DreamInputs.DateTimeField label="Date et Heure" value={date} onChange={setDate} />
            <DreamInputs.TypeSelect label="Type de rêve" options={["cauchemar","lucide","ordinaire"]} value={type} onChange={setType} />
            <DreamInputs.EmotionStepper label="État émotionnel Avant" value={before} onChange={setBefore} />
            <DreamInputs.EmotionStepper label="État émotionnel Après" value={after} onChange={setAfter} />
            <DreamInputs.TagInput label="Personnages présents" tags={characters} onChange={setCharacters} />
            <DreamInputs.TextArea label="Lieu du rêve" value={place} onChange={setPlace} placeholder="Décrire le lieu" />
            <DreamInputs.EmotionStepper label="Intensité émotionnelle" value={intensity} onChange={setIntensity} min={0} max={10} />
            <DreamInputs.EmotionStepper label="Clarté du rêve" value={clarity} onChange={setClarity} min={0} max={10} />
            <DreamInputs.TagInput label="Tags" tags={tags} onChange={setTags} />
            <DreamInputs.TypeSelect label="Qualité du sommeil" options={["excellente","bonne","moyenne","pauvre"]} value={sleepQuality} onChange={setSleepQuality as any} />
            <DreamInputs.TextArea label="Signification personnelle" value={meaning} onChange={setMeaning} placeholder="Ce que ce rêve signifie pour vous" />
            <DreamInputs.ToneSelector label="Tonalité globale" value={tone} onChange={setTone} />

            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' }}>
              <Text color="#fff">Enregistrer</Text>
            </TouchableOpacity>
          </YStack>
        </ScrollView>
      </ScrollView>
    </TamaguiProvider>
  )
}