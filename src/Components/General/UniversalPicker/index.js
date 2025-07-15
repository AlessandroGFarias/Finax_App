import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UniversalPicker = ({ mode, items, onSelect, style }) => {
  const [selectedValue, setSelectedValue] = useState(mode === 'date' || mode === 'MiniDate' ? new Date() : 'Selecione uma categoria');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    onSelect(selectedValue);
  }, [selectedValue]);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    setSelectedValue(selectedDate || new Date());
  };

  const handleItemSelect = (item) => {
    setShowPicker(false);
    setSelectedValue(item);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={style}>
        <Text style={{fontWeight:'bold'}}>
            { mode === 'date' && selectedValue.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            { mode === 'category' && selectedValue.toString()}
            { mode === 'MiniDate' && <MaterialCommunityIcons name="calendar" size={25} color="#000"/>}
        </Text>
      </TouchableOpacity>
      { mode === 'MiniDate'  && showPicker && (
        <DateTimePicker
          value={selectedValue}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      { mode === 'date'  && showPicker && (
        <DateTimePicker
          value={selectedValue}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {mode === 'category' && showPicker && (
        <Modal animationType="slide">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {items.map((item) => (
              <TouchableOpacity onPress={() => handleItemSelect(item)}>
                 <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      )}
    </View>
  );
};

export default UniversalPicker;

