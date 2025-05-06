import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import veg from '../../assets/veg.jpg';
import nveg from '../../assets/nveg.jpg';
import utilStyles from '../../styles/utils';
import {Modifier, Variation} from '../../types';
import globalStyles from '../../styles/global';
import {useTranslation} from 'react-i18next';
import COLORS from '../../constants/colors';
import colorStyles from '../../styles/colors';
import {Image} from 'react-native';
import Stepper from '../../components/Stepper';
import Button from '../../components/Button';
import {useAddToCartMutation} from '../../services/api';
import {Cart} from '../../types/Cart';

interface Payload {
  variation: Variation;
  cart: Cart;
}

interface ModifierProps {
  payload: Payload;
  sheetId: string;
}

function ModifiersSheet({sheetId, payload}: ModifierProps): JSX.Element {
  const [selectedModifiers, setSelectedModifiers] = useState<any>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [addToCartAPI] = useAddToCartMutation();
  const [loading, setLoading] = useState(false);
  const scrollHandlers = useScrollHandlers<ScrollView>(
    'scrollview-1',
    actionSheetRef,
  );
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const sheetDismiss = () => {
    SheetManager.hide(sheetId);
  };
  const handleModifierQuantityChange = (
    id,
    maxLimit: number | undefined,
    variation,
    quantity: number,
  ) => {
    const item = {
      item_variation_group_id: id,
      group_item_variation_id: variation.id,
      item_variation_name: variation.name,
      type: 'modifier',
      label: variation.inventory?.selling_price
        ? `${t('toCurrency', {
            value: payload.variation.inventory.selling_price,
          })} - ${variation.name}`
        : `${variation.name}`,
      price: variation.inventory?.selling_price || 0,
      qty: quantity,
      quantity: quantity,
      unit_measure_type: variation.unit_measure_type,
      item_variation_id: variation.id,
      item_category_id: variation.item_category_id,
      item_category_name: variation.item_category_name,
      alternate_name: variation.custom_attributes?.alternate_language || null,
      groups: [],
      notes: '',
      kot_device: variation?.inventory?.kot_device?.id
        ? {
            id: variation.inventory.kot_device.id,
          }
        : null,
    };

    const index = selectedModifiers.findIndex(
      sm =>
        sm.item_variation_group_id === item.item_variation_group_id &&
        sm.group_item_variation_id === item.group_item_variation_id,
    );

    const list = [...selectedModifiers];
    if (index > -1) {
      if (quantity) {
        if (maxLimit === undefined || quantity <= maxLimit) {
          list[index] = item;
        }
      } else {
        list.splice(index, 1);
      }
    } else {
      list.push(item);
    }
    setSelectedModifiers(list);

    const itemDetail = JSON.parse(JSON.stringify(payload.variation));
    itemDetail.groups = [...list];
    itemDetail.modifiers = [];

    itemDetail.inventory = {
      ...itemDetail.inventory,
      selling_price: [...list].reduce((price, g) => {
        price += g.price * g.quantity;
        return price;
      }, itemDetail.inventory.selling_price),
    };

    const localCart = JSON.parse(JSON.stringify(payload.cart));
    const filtered = filterItem(localCart.items, {
      ...itemDetail,
      price: itemDetail.inventory.selling_price,
    });


    if (filtered?.quantity) {
      setQuantity(filtered.quantity);
    } else {
      setQuantity(0);
    }
  };

  const submitAction = async () => {
    // addToCartAPI()
  };

  const filterItem = (items, item, returnType) => {
    const modifierFilter = (arr, m) => {
      if (m.type === 'modifier') {
        arr.push(m.group_item_variation_id);
      }

      return arr;
    };

    const itemModifiers = item.groups
      ? item.groups.reduce(modifierFilter, [])
      : [];
    const index = items.findIndex(i => {
      const iModifiers = i.groups ? i.groups.reduce(modifierFilter, []) : [];

      return (
        i.id === item.id &&
        i.price === item.price &&
        i.batch_id === (item.batch_id || undefined) &&
        iModifiers.filter(m => !itemModifiers.includes(m)).length === 0 &&
        itemModifiers.filter(m => !iModifiers.includes(m)).length === 0 &&
        (!i.custom_attributes?.gift_card ||
          i.custom_attributes.gift_card.id ===
            item.custom_attributes?.gift_card?.id)
      );
    });

    if (returnType === 'index') {
      return index;
    } else {
      return index !== -1 ? {...items[index]} : null;
    }
  };

  const handleQuantityChange = qty => {
    setQuantity(qty);
    const variation = {...payload.variation};
    variation.groups = selectedModifiers;
    variation.modifiers = [];
    variation.inventory = {
      ...variation.inventory,
      selling_price: selectedModifiers.reduce((price, g) => {
        price += g.price * g.quantity;
        return price;
      }, variation.inventory.selling_price),
    };

    setLoading(true);
    addToCartAPI({item: variation, quantity: qty})
      .then(response => console.log('response', JSON.stringify(response)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <ActionSheet
      id={sheetId}
      isModal={true}
      useBottomSafeAreaPadding={true}
      drawUnderStatusBar={true}
      snapPoints={DeviceInfo.isLandscapeSync() ? [5] : [100]}>
      <SafeAreaView>
        <View
          style={[
            utilStyles.flexRow,
            utilStyles.justifyContentBetween,
            utilStyles.p4,
          ]}>
          <View>
            <Text style={[globalStyles.p]}>
              {payload.variation.name} -{' '}
              {t('toCurrency', {
                value: selectedModifiers.reduce((price, sm) => {
                  price += sm.price * sm.quantity;
                  return price;
                }, payload.variation.inventory.selling_price),
              })}
            </Text>
            <Text style={[globalStyles.title]}>
              {t('customiseMessage')}{' '}
              {payload.variation.custom_attributes?.group_conditions
                ?.max_selectable
                ? `${selectedModifiers.length}/${payload.variation.custom_attributes.group_conditions.max_selectable}`
                : null}
            </Text>
          </View>
          <Pressable style={styles.close} onPress={sheetDismiss}>
            <MaterialCommunityIcons
              name="window-close"
              size={20}
              color={COLORS.black}
            />
          </Pressable>
        </View>
        <View style={styles.divider} />
        <ScrollView
          {...scrollHandlers}
          contentContainerStyle={{paddingBottom: 120}}
          style={{maxHeight: Dimensions.get('window').height - 250}}>
          <View style={[utilStyles.px4]}>
            {payload.variation.modifiers.map((modifier: Modifier) => {
              const modifierGroup = selectedModifiers.filter(
                (selectedModifier: any) =>
                  selectedModifier.item_variation_group_id === modifier.id,
              );
              const modifierLimit = modifierGroup.length;

              const modifierMaxLimit = modifier.custom_attributes.max_selectable
                ? Number(modifier.custom_attributes.max_selectable)
                : undefined;

              return (
                <View style={utilStyles.mb4}>
                  <Text
                    style={[
                      globalStyles.subtitle,
                      utilStyles.capitalize,
                      utilStyles.mb1,
                    ]}>
                    {modifier.name} ({modifierLimit}/
                    {modifierMaxLimit || modifier.variations.length}){' '}
                    <Text style={colorStyles.red}>
                      {modifier.is_required ? '*' : null}
                    </Text>
                  </Text>
                  <View
                    style={[
                      utilStyles.px4,
                      utilStyles.py2,
                      colorStyles.bgWhite,
                      utilStyles.my1,
                      utilStyles.br4,
                      styles.modifierCard,
                    ]}>
                    {modifier.variations.map((variation: Variation) => {
                      const item = selectedModifiers.filter(
                        sm =>
                          sm.item_variation_group_id === modifier.id &&
                          sm.group_item_variation_id === variation.id,
                      );
                      const modifierQty = selectedModifiers.reduce(
                        (qty, sm) => {
                          qty += sm.quantity;
                          return qty;
                        },
                        0,
                      );
                      const maxLimit = modifier?.custom_attributes
                        ?.max_selectable
                        ? Number(modifier?.custom_attributes?.max_selectable)
                        : undefined;
                      const quantity = item.length ? item[0].quantity : 0;
                      const groupQuantity = modifierGroup.reduce((qty, sm) => {
                        qty += sm.quantity;
                        return qty;
                      }, 0);

                      return (
                        <View style={[styles.listItem]}>
                          <View style={styles.listItemContent}>
                            <Image
                              source={
                                variation.food_type === 'veg' ? veg : nveg
                              }
                              style={styles.foodType}
                            />
                            <View
                              style={[
                                utilStyles.flexRow,
                                utilStyles.flex,
                                utilStyles.mx2,
                                utilStyles.alignItemsCenter,
                              ]}>
                              <Text
                                style={[
                                  globalStyles.subtitle,
                                  utilStyles.capitalize,
                                  {width: '60%'},
                                ]}>
                                {variation.name}
                              </Text>
                              <Text
                                style={[
                                  utilStyles.ml1,
                                  globalStyles.p,

                                  utilStyles.textRight,
                                  {width: '40%'},
                                ]}>
                                {t('toCurrency', {
                                  value:
                                    variation.inventory.selling_price *
                                    (quantity || 1),
                                })}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.listItemEnd}>
                            <View style={styles.stepper}>
                              <Stepper
                                loading={false}
                                quantity={quantity}
                                minimum={0}
                                maximum={5}
                                incrementAction={() => {
                                  handleModifierQuantityChange(
                                    modifier.id,
                                    maxLimit,
                                    variation,
                                    quantity + 1,
                                  );
                                }}
                                decrementAction={() => {
                                  handleModifierQuantityChange(
                                    modifier.id,
                                    maxLimit,
                                    variation,
                                    quantity - 1,
                                  );
                                }}
                                action={null}
                              />
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={[styles.footer, styles.modifierCard]}>
          <Text style={[globalStyles.p, styles.flex8]}>
            {payload.variation.name} -{' '}
            {t('toCurrency', {
              value: selectedModifiers.reduce((price, sm) => {
                price += sm.price * sm.quantity;
                return price;
              }, payload.variation.inventory.selling_price),
            })}
          </Text>
          <View style={styles.stepper}>
            <Stepper
              loading={loading}
              quantity={quantity}
              minimum={0}
              incrementAction={() => handleQuantityChange(quantity + 1)}
              decrementAction={() => handleQuantityChange(quantity - 1)}
              action={null}
            />
          </View>
        </View>
      </SafeAreaView>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  close: {
    elevation: 4,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: COLORS.grey,
    marginVertical: 16,
  },
  foodType: {
    width: 16,
    height: 16,
    marginTop: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },
  modifierCard: {
    borderColor: COLORS.grey,
    borderWidth: StyleSheet.hairlineWidth,
  },
  listItemContent: {
    width: '70%',
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  listItemEnd: {
    display: 'flex',
    width: '30%',
    alignItems: 'flex-end',
  },
  stepper: {
    width: 100,
    height: 24,
  },
  footer: {
    backgroundColor: COLORS.white,
    elevation: 3,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    borderRadius: 10,
  },
  continue: {
    backgroundColor: COLORS.green30,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: 32,
  },
  footerStepper: {
    width: 160,
    // height: 40,
  },
  flex8: {
    flex: 0.8,
  },
});

export default ModifiersSheet;
