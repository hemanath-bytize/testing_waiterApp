import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Variation} from '../../types';
import COLORS from '../../constants/colors';
import utilStyles from '../../styles/utils';
import globalStyles from '../../styles/global';
import Stepper from '../../components/Stepper';
import {useAddToCartMutation} from '../../services/api';
import {Image} from 'react-native';
import veg from '../../assets/veg.jpg';
import nveg from '../../assets/nveg.jpg';
import {capitalize} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {Cart} from '../../types/Cart';
import {setItemNotes} from '../../redux/slices/cartSlice';
import {Formik} from 'formik';
import Button from '../../components/Button';
interface CartItemCardProps {
  variation: Variation;
  index: number;
}
const notesValidationSchema = yup.object().shape({
  notes: yup.string().required('Enter the notes'),
});

function CartItemCard({variation, index}: CartItemCardProps): JSX.Element {
  const {t} = useTranslation();
  const [quantity, setQuantity] = useState(variation.quantity || 0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState(null);
  const [showPickerModal, setShowPickerModal] = useState({
    visible: false,
    item: null,
  });

  const cart: Cart = useSelector((state: RootState) => state.cart);
  const [addToCartAPI] = useAddToCartMutation();
  const handleQuantityChange = qty => {
    setQuantity(qty);
    const item = {...variation};
    setLoading(true);
    addToCartAPI({item, quantity: qty})
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const upadtedItemNotes = (note: any) => {
    const indexItem = [...cart.items];
    if (showPickerModal.item) {
      let items = indexItem.map(item =>
        item.id === showPickerModal.item?.id ? {...item, notes: note} : item,
      );
      dispatch(setItemNotes(items));
    }
    setShowPickerModal({visible: false, item: null});
  };

  const submitAction = values => {
    upadtedItemNotes(values.notes);
  };

  useEffect(() => {
    const item = [...cart.items];
    item.map(item => {
      if (variation.id === item.id) {
        if (item.notes) {
          setNotes(item.notes);
        } else {
          setNotes(null);
        }
      }
    });
  }, [cart.items]);

  return (
    <View style={styles.card} key={index}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={[styles.container]}>
          <View style={[utilStyles.flexRow, utilStyles.alignItemsCenter, ,]}>
            <Image
              source={variation.food_type === 'veg' ? veg : nveg}
              style={styles.foodType}
            />
            <Text
              style={[globalStyles.p, globalStyles.boldText, utilStyles.ml1]}>
              {variation.name}
            </Text>
          </View>
          {variation?.combo ? (
            <Text style={[globalStyles.subP]}>
              {variation?.combo.variations
                ?.map((combo: any) => combo.name)
                .join(', ')}
            </Text>
          ) : null}
          {variation?.groups?.length > 0 ? (
            <>
              <Text style={[globalStyles.subP]}>
                {variation?.groups
                  ?.filter(g => g.type === 'combo')
                  .map(g => `${g.item_variation_name}`)
                  .join(', ')}
              </Text>
              <Text style={[globalStyles.subP]}>
                {variation.groups
                  ?.filter(g => g.type === 'modifier')
                  .map(g => `${g.item_variation_name} x ${g.quantity}`)
                  .join(', ')}
              </Text>
            </>
          ) : null}
        </View>
        <Pressable
          onPress={() => {
            setShowPickerModal({visible: true, item: variation});
          }}
          style={styles.addNotes}>
          <MaterialCommunityIcons
            name="file-document-edit-outline"
            size={25}
            color={COLORS.primary}
          />
          <Text style={{fontSize: 12, marginLeft: 3, color: COLORS.black}}>
            {t('notes')}
          </Text>
        </Pressable>
      </View>
      {notes ? (
        <View style={{marginBottom: 10}}>
          <Text style={styles.notesText}>{`notes: ${notes}`}</Text>
        </View>
      ) : null}
      <View style={styles.priceContainer}>
        <View style={[utilStyles.alignSelfCenter, styles.stepperWidth]}>
          <Stepper
            loading={loading}
            action={null}
            quantity={quantity}
            minimum={variation.ordered_quantity || 0}
            incrementAction={() => handleQuantityChange(quantity + 1)}
            decrementAction={() => handleQuantityChange(quantity - 1)}
          />
        </View>
        <Text style={[globalStyles.p, globalStyles.boldText, utilStyles.ml4]}>
          {t('toCurrency', {
            value: variation.calculation.sub_total,
          })}
        </Text>
      </View>

      <Modal visible={showPickerModal.visible} transparent animationType="none">
        <Pressable
          style={styles.notesCard}
          onPress={() => {
            setShowPickerModal({visible: false, item: null});
          }}>
          <Pressable style={[styles.card, styles.textInputCard]}>
            <Text style={styles.addNotesTitle}>{t('addItemNotes')}</Text>
            <Formik
              validationSchema={notesValidationSchema}
              initialValues={{notes: notes}}
              onSubmit={submitAction}>
              {({
                values,
                touched,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    value={values.notes}
                    placeholder={capitalize(t('notes'))}
                    textAlign="center"
                    numberOfLines={3}
                  />
                  {touched.notes && errors.notes ? (
                    <Text style={styles.errorMassage}>{errors.notes}</Text>
                  ) : null}
                  <Button
                    label={t('submit')}
                    action={handleSubmit}
                    loading={false}
                  />
                </>
              )}
            </Formik>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    padding: 8,
    backgroundColor: COLORS.white,
    marginBottom: 8,
    borderRadius: 8,
    minHeight: 60,
  },
  image: {
    width: 120,
    height: 90,
    backgroundColor: COLORS.grey50,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceContainer: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  foodType: {
    width: 16,
    height: 16,
  },
  stepperWidth: {width: 120},
  input: {
    height: 40,
    width: '100%',
    padding: 0,
    marginVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.primary,
  },
  submitButtonText: {
    ...globalStyles.title,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    width: '50%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  submit: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMassage: {
    textAlign: 'center',
    color: COLORS.red,
    textTransform: 'capitalize',
  },
  addNotesTitle: {
    paddingVertical: 20,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  textInputCard: {
    width: '80%',
    height: 230,
  },
  notesCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0003',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesText: {
    textTransform: 'capitalize',
    fontSize: 14,
    color: COLORS.black,
  },
  addNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 30,
  },
});

const equal = (prev: any, next: any) => {
  if (
    prev.variation.calculation.sub_total !==
    next.variation.calculation.sub_total
  ) {
    return false;
  }
  return true;
};

export default React.memo(CartItemCard, equal);
