import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export type DreamType = 'cauchemar' | 'lucide' | 'ordinaire' | string
export type SleepQuality = 'excellente' | 'bonne' | 'moyenne' | 'pauvre'
export type Tone = 'positive' | 'neutre' | 'negative'

export interface DreamEntry {
  date?: Date
  type?: DreamType
  emotionBefore?: number
  emotionAfter?: number
  characters?: string[]
  place?: string
  intensity?: number
  clarity?: number
  tags?: string[]
  sleepQuality?: SleepQuality
  meaning?: string
  tone?: Tone
}

/* Simple presentational components for React Native (no external deps). */

export function DateTimeField({
  label,
  value,
  onChange,
}: {
  label?: string
  value?: Date | null
  onChange: (d: Date | null) => void
}) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <Text style={styles.value}>{value ? value.toLocaleString() : 'Non renseigné'}</Text>
        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.btn} onPress={() => onChange(new Date())}>
            <Text style={styles.btnText}>Maintenant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => onChange(null)}>
            <Text style={styles.btnText}>Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export function TypeSelect({
  label,
  options,
  value,
  onChange,
}: {
  label?: string
  options: string[]
  value?: string
  onChange: (v: string) => void
}) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const selected = opt === value
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onChange(opt)}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export function EmotionStepper({
  label,
  value = 5,
  onChange,
  min = 0,
  max = 10,
}: {
  label?: string
  value?: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.max(min, value - 1))}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.min(max, value + 1))}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function TagInput({
  label,
  tags = [],
  onChange,
}: {
  label?: string
  tags?: string[]
  onChange: (t: string[]) => void
}) {
  const [text, setText] = useState('')
  function add() {
    const v = text.trim()
    if (!v) return
    onChange([...tags, v])
    setText('')
  }
  function remove(i: number) {
    const next = tags.filter((_, idx) => idx !== i)
    onChange(next)
  }
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}> 
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Ajouter un tag" />
        <TouchableOpacity style={styles.btn} onPress={add}>
          <Text style={styles.btnText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagsRow}>
        {tags.map((t, i) => (
          <TouchableOpacity key={t + i} style={styles.tag} onPress={() => remove(i)}>
            <Text style={styles.tagText}>{t} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export function TextArea({
  label,
  value = '',
  onChange,
  placeholder,
}: {
  label?: string
  value?: string
  onChange: (s: string) => void
  placeholder?: string
}) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, styles.textarea]}
        multiline
        numberOfLines={4}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
      />
    </View>
  )
}

export function ToneSelector({ label, value, onChange }: { label?: string; value?: Tone; onChange: (t: Tone) => void }) {
  const opts: { key: Tone; label: string }[] = [
    { key: 'positive', label: 'Positive' },
    { key: 'neutre', label: 'Neutre' },
    { key: 'negative', label: 'Négative' },
  ]
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.optionsRow}>
        {opts.map((o) => (
          <TouchableOpacity
            key={o.key}
            style={[styles.option, value === o.key && styles.optionSelected]}
            onPress={() => onChange(o.key)}
          >
            <Text style={[styles.optionText, value === o.key && styles.optionTextSelected]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  field: { marginVertical: 8 },
  label: { marginBottom: 6, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowButtons: { flexDirection: 'row' },
  btn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#007AFF', borderRadius: 6, marginLeft: 8 },
  stepBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 6 },
  btnText: { color: '#fff' },
  value: { fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, flex: 1 },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8 },
  optionSelected: { backgroundColor: '#007AFF' },
  optionText: { color: '#111' },
  optionTextSelected: { color: '#fff' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tag: { backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 13 },
})

export default {
  DateTimeField,
  TypeSelect,
  EmotionStepper,
  TagInput,
  TextArea,
  ToneSelector,
}
