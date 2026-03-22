import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

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
  onChange: (dateValue: Date | null) => void
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // Keep only the date portion to avoid timezone shifts when serializing to ISO.
  function normalizeDate(selectedDate: Date) {
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
  }

  function handlePickerChange(_: any, selectedDate?: Date) {
    if (Platform.OS !== 'ios') {
      setIsPickerOpen(false)
    }
    if (selectedDate) {
      onChange(normalizeDate(selectedDate))
    }
  }

  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <Text style={styles.value}>{value ? value.toLocaleDateString() : 'Non renseigné'}</Text>
        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.btn} onPress={() => setIsPickerOpen(true)}>
            <Text style={styles.btnText}>Choisir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => onChange(null)}>
            <Text style={styles.btnText}>Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isPickerOpen ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickerChange}
        />
      ) : null}
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
        {options.map((optionValue) => {
          const isSelected = optionValue === value
          return (
            <TouchableOpacity
              key={optionValue}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onChange(optionValue)}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{optionValue}</Text>
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
  onChange: (nextTags: string[]) => void
}) {
  const [tagInputText, setTagInputText] = useState('')

  function handleAddTag() {
    const trimmedTag = tagInputText.trim()
    if (!trimmedTag) return
    onChange([...tags, trimmedTag])
    setTagInputText('')
  }

  function handleRemoveTag(tagIndex: number) {
    const nextTags = tags.filter((_, idx) => idx !== tagIndex)
    onChange(nextTags)
  }

  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}> 
        <TextInput
          style={styles.input}
          value={tagInputText}
          onChangeText={setTagInputText}
          placeholder="Ajouter un tag"
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity style={styles.btn} onPress={handleAddTag}>
          <Text style={styles.btnText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagsRow}>
        {tags.map((tagValue, index) => (
          <TouchableOpacity key={tagValue + index} style={styles.tag} onPress={() => handleRemoveTag(index)}>
            <Text style={styles.tagText}>{tagValue} ✕</Text>
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
  onChange: (textValue: string) => void
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
        placeholderTextColor="#94A3B8"
      />
    </View>
  )
}

export function ToneSelector({
  label,
  value,
  onChange,
}: {
  label?: string
  value?: Tone
  onChange: (toneValue: Tone) => void
}) {
  const toneOptions: { key: Tone; label: string }[] = [
    { key: 'positive', label: 'Positive' },
    { key: 'neutre', label: 'Neutre' },
    { key: 'negative', label: 'Négative' },
  ]
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.optionsRow}>
        {toneOptions.map((toneOption) => (
          <TouchableOpacity
            key={toneOption.key}
            style={[styles.option, value === toneOption.key && styles.optionSelected]}
            onPress={() => onChange(toneOption.key)}
          >
            <Text style={[styles.optionText, value === toneOption.key && styles.optionTextSelected]}>{toneOption.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    marginVertical: 4,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EAF7',
    shadowColor: '#1E293B',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#344256',
    fontSize: 13,
    letterSpacing: 0.4,
    fontFamily: 'SpaceMono',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowButtons: { flexDirection: 'row' },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    marginLeft: 8,
  },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
  },
  btnText: { color: '#FFFFFF', fontWeight: '600' },
  value: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  input: {
    borderWidth: 1,
    borderColor: '#D6E3F7',
    padding: 9,
    borderRadius: 10,
    flex: 1,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  textarea: { minHeight: 84, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D9E0FF',
  },
  optionSelected: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  optionText: { color: '#1E293B', fontWeight: '600' },
  optionTextSelected: { color: '#FFFFFF' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 13, color: '#15803D', fontWeight: '700' },
})

export default {
  DateTimeField,
  TypeSelect,
  EmotionStepper,
  TagInput,
  TextArea,
  ToneSelector,
}
