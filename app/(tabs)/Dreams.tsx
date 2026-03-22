import AsyncStorage from '@react-native-async-storage/async-storage'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, H2, ScrollView, TamaguiProvider, Text, YStack } from 'tamagui'
import DreamInputs, { SleepQuality, Tone } from '../../components/DreamInputs.native'
import config from '../../tamagi.config'

export default function DreamsScreen() {
  const [dreamDate, setDreamDate] = useState<Date | null>(null)
  const [dreamType, setDreamType] = useState<string>('ordinaire')
  const [emotionBefore, setEmotionBefore] = useState<number>(5)
  const [emotionAfter, setEmotionAfter] = useState<number>(5)
  const [dreamCharacters, setDreamCharacters] = useState<string[]>([])
  const [dreamPlace, setDreamPlace] = useState<string>('')
  const [intensity, setIntensity] = useState<number>(5)
  const [clarity, setClarity] = useState<number>(5)
  const [tags, setTags] = useState<string[]>([])
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('moyenne')
  const [personalMeaning, setPersonalMeaning] = useState<string>('')
  const [tone, setTone] = useState<Tone>('neutre')
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null)

  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()
  const scrollBottomPadding = tabBarHeight + insets.bottom + 28
  
  const router = useRouter()
  const params = useLocalSearchParams()
  const editingEntryIdParam = (params as { editId?: string }).editId

  useEffect(() => {
    if (!editingEntryIdParam) return
    if (editingEntryId && String(editingEntryId) === String(editingEntryIdParam)) return

    let isMounted = true
    // When an edit id is present in route params, hydrate the form from storage once.
    ;(async () => {
      try {
        const storedEntriesRaw = await AsyncStorage.getItem('@dreams:entries')
        const storedEntries = storedEntriesRaw ? JSON.parse(storedEntriesRaw) : []
        const entryToEdit = storedEntries.find((entry: any) => String(entry.id) === String(editingEntryIdParam))
        if (!isMounted) return
        if (entryToEdit) {
          setEditingEntryId(entryToEdit.id)
          setDreamDate(entryToEdit.date ? new Date(entryToEdit.date) : null)
          setDreamType(entryToEdit.type ?? 'ordinaire')
          setEmotionBefore(entryToEdit.emotionBefore ?? 5)
          setEmotionAfter(entryToEdit.emotionAfter ?? 5)
          setDreamCharacters(entryToEdit.characters ?? [])
          setDreamPlace(entryToEdit.place ?? '')
          setIntensity(entryToEdit.intensity ?? 5)
          setClarity(entryToEdit.clarity ?? 5)
          setTags(entryToEdit.tags ?? [])
          setSleepQuality(entryToEdit.sleepQuality ?? 'moyenne')
          setPersonalMeaning(entryToEdit.meaning ?? '')
          setTone(entryToEdit.tone ?? 'neutre')
        }
      } catch (e) {
        console.error('Failed to load editing entry', e)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [editingEntryIdParam])

  const handleSubmit = () => {
    const entryPayload = {
      date: dreamDate ? dreamDate.toISOString() : null,
      type: dreamType,
      emotionBefore,
      emotionAfter,
      characters: dreamCharacters,
      place: dreamPlace,
      intensity,
      clarity,
      tags,
      sleepQuality,
      meaning: personalMeaning,
      tone,
    }

    ;(async () => {
      try {
        const storedEntriesRaw = await AsyncStorage.getItem('@dreams:entries')
        const storedEntries = storedEntriesRaw ? JSON.parse(storedEntriesRaw) : []
        let nextEntries
        // If an id is present, we are editing an existing dream entry.
        // Otherwise, we create a new one and insert it at the top of the list.
        if (editingEntryId) {
          // We compare ids as strings to avoid number/string mismatch issues
          // (route params often come as strings).
          const entryIndex = storedEntries.findIndex((entry: any) => String(entry.id) === String(editingEntryId))
          if (entryIndex !== -1) {
            // Standard update path: keep original entry shape, overwrite only form fields.
            storedEntries[entryIndex] = { ...storedEntries[entryIndex], ...entryPayload, id: editingEntryId }
            nextEntries = storedEntries
          } else {
            // Fallback path: if the id is not found (deleted externally, stale state, etc.),
            // we still preserve user work by re-inserting the edited payload as a new first item.
            nextEntries = [{ id: editingEntryId, ...entryPayload }, ...storedEntries]
          }
        } else {
          const newEntryId = Date.now()
          nextEntries = [{ id: newEntryId, ...entryPayload }, ...storedEntries]
        }
        await AsyncStorage.setItem('@dreams:entries', JSON.stringify(nextEntries))
        Alert.alert('Enregistré', editingEntryId ? 'Rêve modifié' : 'Entrée de rêve enregistrée')
        setEditingEntryId(null)
        
        // Reset form
        setDreamDate(null); setDreamType('ordinaire'); setEmotionBefore(5); setEmotionAfter(5)
        setDreamCharacters([]); setDreamPlace(''); setIntensity(5); setClarity(5)
        setTags([]); setSleepQuality('moyenne'); setPersonalMeaning(''); setTone('neutre')
        
        try { router.replace('/(tabs)/Dreams') } catch (e) { /* ignore */ }
      } catch (e) {
        console.error(e)
        Alert.alert('Erreur', 'Impossible de sauvegarder')
      }
    })()
  }

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <ScrollView
        backgroundColor="#0B1220"
        contentContainerStyle={{
          flexGrow: 1,
          padding: 12,
          paddingBottom: scrollBottomPadding,
          alignItems: 'center',
        }}
      >
        <YStack
          width="100%"
          maxWidth={760}
          gap="$3"
          paddingBottom="$8"
        >
          <YStack
            position="relative"
            overflow="hidden"
            borderRadius="$12"
            padding="$5"
            gap="$2"
            backgroundColor="#0F172A"
          >
            <YStack
              position="absolute"
              top={-70}
              left={-90}
              width={220}
              height={220}
              borderRadius={999}
              opacity={0.35}
              backgroundColor="#22D3EE"
            />
            <YStack
              position="absolute"
              bottom={-90}
              right={-40}
              width={260}
              height={260}
              borderRadius={999}
              opacity={0.3}
              backgroundColor="#A855F7"
            />
            <Text fontFamily="SpaceMono" fontSize="$2" color="#E2E8F0" opacity={0.8}>
              Journal de rêves
            </Text>
            <H2 color="#F8FAFC" fontFamily="SpaceMono">
              Donne un style fort à tes souvenirs nocturnes
            </H2>
            <Text color="#CBD5F5" opacity={0.9}>
              Une interface plus créative, sans toucher à la logique du formulaire.
            </Text>
          </YStack>

          <YStack
            backgroundColor="#FFFFFF"
            borderRadius="$12"
            padding="$4"
            gap="$3"
            borderWidth={1}
            borderColor="#E2E8F0"
          >
            <DreamInputs.DateTimeField label="Date du rêve" value={dreamDate} onChange={setDreamDate} />
            <DreamInputs.TypeSelect label="Type de rêve" options={["cauchemar", "lucide", "ordinaire"]} value={dreamType} onChange={setDreamType} />
            <DreamInputs.EmotionStepper label="État émotionnel avant" value={emotionBefore} onChange={setEmotionBefore} />
            <DreamInputs.EmotionStepper label="État émotionnel après" value={emotionAfter} onChange={setEmotionAfter} />
            <DreamInputs.TagInput label="Personnages présents" tags={dreamCharacters} onChange={setDreamCharacters} />
            <DreamInputs.TextArea label="Lieu du rêve" value={dreamPlace} onChange={setDreamPlace} placeholder="Décrire le lieu" />
            <DreamInputs.EmotionStepper label="Intensité émotionnelle" value={intensity} onChange={setIntensity} min={0} max={10} />
            <DreamInputs.EmotionStepper label="Clarté du rêve" value={clarity} onChange={setClarity} min={0} max={10} />
            <DreamInputs.TagInput label="Tags" tags={tags} onChange={setTags} />
            <DreamInputs.TypeSelect label="Qualité du sommeil" options={["excellente", "bonne", "moyenne", "pauvre"]} value={sleepQuality} onChange={setSleepQuality as any} />
            <DreamInputs.TextArea label="Signification personnelle" value={personalMeaning} onChange={setPersonalMeaning} placeholder="Ce que ce rêve signifie pour vous" />
            <DreamInputs.ToneSelector label="Tonalité globale" value={tone} onChange={setTone} />

            <Button
              theme="active"
              marginTop="$3"
              marginBottom="$2"
              borderRadius="$8"
              minHeight={58}
              justifyContent="center"
              alignItems="center"
              paddingVertical={10}
              overflow="visible"
              onPress={handleSubmit}
            >
              <Text
                fontSize={20}
                lineHeight={28}
                fontWeight="700"
                color="#F8FAFC"
                style={{
                  includeFontPadding: true,
                  textAlignVertical: 'center',
                  paddingBottom: Platform.OS === 'android' ? 2 : 0,
                }}
              >
                {editingEntryId ? 'Modifier le rêve' : 'Enregistrer'}
              </Text>
            </Button>

            <YStack height={12} />
          </YStack>
        </YStack>
      </ScrollView>
    </TamaguiProvider>
  )
}