import { useState } from 'react'
import { Alert, ScrollView, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TamaguiProvider, Text, View, YStack } from 'tamagui'
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

  const handleSubmit = () => {
    const entry = {
      date,
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
    try {
      AsyncStorage.getItem('@dreams:entries').then((res) => {
        const existing = res ? JSON.parse(res) : []
        const next = [entry, ...existing]
        AsyncStorage.setItem('@dreams:entries', JSON.stringify(next))
      })
      console.log('DreamEntry:', entry)
      Alert.alert('Enregistré', 'Entrée de rêve enregistrée')
    } catch (e) {
      console.error(e)
      Alert.alert('Erreur', 'Impossible de sauvegarder')
    }
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