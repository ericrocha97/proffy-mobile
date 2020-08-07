import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableHighlight,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';

interface IPickerValuesItem {
  label: string;
  value: number | string;
}

interface IPickerProps {
  title: string;
  inputStyle?: StyleProp<ViewStyle>;
  pickerValues: IPickerValuesItem[];
  placeholder?: string;
  onChange: React.Dispatch<React.SetStateAction<any>>;
}

const Picker: React.FC<IPickerProps> = ({
  title,
  inputStyle = {},
  pickerValues,
  placeholder = 'Select an option',
  onChange,
}) => {
  const [pickerSelection, setPickerSelection] = useState<number | string | null>(null);
  const [pickerDisplayed, setPickerDisplayed] = useState(false);

  const togglePicker = useCallback(() => {
    setPickerDisplayed(!pickerDisplayed);
  }, [pickerDisplayed]);

  const labelPickerSelection = useMemo(() => {
    const index = pickerValues.findIndex(
      picker => picker.value === pickerSelection,
    );

    if (index >= 0) {
      return pickerValues[index].label;
    }
    return null;
  }, [pickerSelection, pickerValues]);

  const handlePickerItemClick = useCallback(value => {
    setPickerSelection(value);
    onChange(value);
    setPickerDisplayed(false);
  }, [onChange]);

  return (
    <View>
      <TouchableOpacity onPress={togglePicker}>
        <View style={inputStyle}>
          <Text style={pickerSelection === null ? { color: '#6A6180' } : {}}>
            {labelPickerSelection || placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal visible={pickerDisplayed} animationType="slide" transparent>
        <View style={styles.container}>
          <View style={styles.pickerItemsContainer}>
            <Text
              style={{
                borderBottomColor: '#eee',
                borderBottomWidth: 1,
                width: '100%',
                textAlign: 'center',
                paddingBottom: 8,
              }}
            >
              {title}
            </Text>
            {pickerValues.map((value, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handlePickerItemClick(value.value);
                  }}
                  style={{ width: '100%' }}
                >
                  <View style={styles.pickerItemContainer}>
                    <Text style={styles.itemStyle}>{value.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => togglePicker()}
              style={{ paddingTop: 4, paddingBottom: 4 }}
            >
              <Text style={{ color: '#999' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Picker;