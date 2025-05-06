import utilStyles from '../styles/utils';
import COLORS from '../constants/colors';
import colorStyles from '../styles/colors';
import globalStyles from '../styles/global';
import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const CustomPicker = ({
  containerStyle,
  label,
  labelStyle,
  required = false,
  error,
  value,
  leadingAccessory,
  trailingAccessory,
  black = false,
  helperText = null,
  items,
  selectedItem,
  valueStyle = {},
  ...inputProps
}) => {
  const [showPickerModal, setShowPickerModal] = useState(false);

  const renderItems = ({item}: any) => {
    return (
      <SafeAreaView>
        <View
          style={styles.pickerItem}
          onTouchStart={() => {
            inputProps.onChangeText(item);
            setTimeout(() => {
              setShowPickerModal(false);
            }, 100);
          }}>
          {item === value ? (
            <MaterialCommunityIcons
              name="check"
              color={COLORS.primary}
              size={30}
              style={{marginTop: 10}}
            />
          ) : null}
          <Text
            style={[
              utilStyles.capitalize,
              styles.pickerItemText,
              {
                color: item === value ? COLORS.primary : COLORS.black,
                paddingStart: item === value ? 10 : 40,
              },
            ]}>
            {item}
          </Text>
        </View>
        <View style={styles.divider} />
      </SafeAreaView>
    );
  };
  const togglePickerModal = () => setShowPickerModal(false);
  const toggleOnPickerModal = () => setShowPickerModal(true);

  return (
    <View style={containerStyle} onTouchStart={toggleOnPickerModal}>
      {label ? (
        <Text
          style={[
            globalStyles.small,
            black ? colorStyles.black : colorStyles.white,
            labelStyle,
          ]}>
          {label}
          {required && <Text style={colorStyles.red}> *</Text>}
        </Text>
      ) : null}

      <TextInput
        value={value}
        style={[
          utilStyles.capitalize,
          globalStyles.title,
          styles.input,
          styles.inputOutline,
          black ? styles.black : null,
          error ? {borderColor: COLORS.red} : null,
          valueStyle ? valueStyle : null,
        ]}
        {...inputProps}
        editable={false}
      />
      {error ? (
        <Text
          style={[
            globalStyles.small,
            black ? colorStyles.red : colorStyles.primary,
            utilStyles.mt1,
          ]}>
          {error.charAt(0).toUpperCase() + error.slice(1)}
        </Text>
      ) : helperText ? (
        <Text style={[globalStyles.small, colorStyles.black, utilStyles.mt1]}>
          {helperText}
        </Text>
      ) : null}

      <Modal
        style={styles.modalContainer}
        visible={showPickerModal}
        onDismiss={togglePickerModal}
        onRequestClose={togglePickerModal}>
        <FlatList
          data={items}
          renderItem={renderItems}
          scrollToOverflowEnabled
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputOutline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.primary,
    height: 40,
  },
  input: {
    padding: 0,
    width: '100%',
  },
  black: {
    borderColor: COLORS.black,
    color: COLORS.black,
  },
  trailingAccessory: {
    paddingRight: 8,
    position: 'absolute',
    right: 1,
    bottom: 12,
  },
  leadingAccessory: {
    paddingRight: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: COLORS.grey,
    marginVertical: 16,
  },
  pickerItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 10,
  },
  pickerItemText: {
    fontSize: 20,

    paddingEnd: 10,
    paddingTop: 10,
  },
  modalContainer: {
    backgroundColor: 'green',
  },
});

export default CustomPicker;
