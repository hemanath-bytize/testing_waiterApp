import _ from 'lodash';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {SheetManager} from 'react-native-actions-sheet';
import {Image, StyleSheet, Text, View} from 'react-native';

import {Variation} from '../../types';
import veg from '../../assets/veg.jpg';
import nveg from '../../assets/nveg.jpg';
import COLORS from '../../constants/colors';
import utilStyles from '../../styles/utils';
import {RootState} from '../../redux/store';
import colorStyles from '../../styles/colors';
import globalStyles from '../../styles/global';
import Stepper from '../../components/Stepper';
import {useAddToCartMutation} from '../../services/api';
import { Cart } from '../../types/Cart';

interface ItemCardProps {
  variation: Variation;
  index: number;
  disabled: boolean;
}

function VariationCard({
  variation,
  index,
  disabled,
}: ItemCardProps): JSX.Element {
  const {t} = useTranslation();
  const [cartItem, setCartItem] = useState<Variation>(variation);
  const [quantity, setQuantity] = useState(variation.quantity || 0);
  const merchant = useSelector((state: any) => state.server?.merchant);
  const [loading, setLoading] = useState(false);
  const items: Variation[] = useSelector(
    (state: RootState) => state.cart.items,
  );
  const cart: Cart = useSelector((state: RootState) => state.cart);
  const [addToCartAPI] = useAddToCartMutation();
  const handleQuantityChange = qty => {
    if (qty === 0) {
      setQuantity(qty);
    }
    const item = {...cartItem};
    setLoading(true);
    addToCartAPI({item, quantity: qty})
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const ci = items.filter(item => item.id === variation.id);
    if (ci.length) {
      setQuantity(ci[0].quantity);
    }
  }, [items, variation]);
  useEffect(() => {
    const ci = items.filter(item => item.id === variation.id);
    if (ci.length) {
      setCartItem(ci[0]);
    }
  }, []);

  const showModifiers = () => {
    SheetManager.show('item-modifiers', {payload: {variation, cart}});

  };

  return (
    <View style={styles.card} key={index}>
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <View style={[utilStyles.flexRow, utilStyles.w100]}>
            <View style={styles.typeImage}>
              <Image
                source={cartItem.food_type === 'veg' ? veg : nveg}
                style={styles.foodType}
              />
            </View>
            <View style={styles.itemDetails}>
              <Text
                style={[
                  globalStyles.p,
                  globalStyles.boldText,
                  styles.itemName,
                ]}>
                {cartItem.name}
              </Text>
              {cartItem.combo ? (
                <Text style={[globalStyles.subP]}>
                  {cartItem.combo?.variations
                    ?.map((combo: any) => combo.name)
                    .join(', ')}
                </Text>
              ) : null}
              {cartItem?.groups?.length > 0 ? (
                <Text style={[globalStyles.subP]}>
                  {cartItem?.groups
                    ?.filter(g => g.type === 'combo')
                    .map(g => `${g.item_variation_name}`)
                    .join(', ')}
                </Text>
              ) : null}
            </View>
          </View>
          <Text style={[globalStyles.small]} numberOfLines={2}>
            {cartItem.description}
          </Text>
        </View>
        <Text style={[globalStyles.p]}>
          {t('toCurrency', {
            value: cartItem.inventory.selling_price,
          })}
        </Text>
      </View>
      <View>
        <View style={styles.imageContainer}>
          {merchant.merchant.settings.general.show_item_image ? (
            <Image
              source={cartItem.image_url ? {uri: cartItem.image_url} : null}
              style={styles.image}
            />
          ) : null}
        </View>
        {!disabled ? (
          <View style={[styles.stepperContainer]}>
            <View
              style={[
                utilStyles.flex,
                utilStyles.alignSelfCenter,
                styles.stepperWidth,
              ]}>
              <Stepper
                loading={loading}
                quantity={variation.modifiers.length ? 0 : quantity}
                minimum={cartItem.ordered_quantity || 0}
                incrementAction={() => handleQuantityChange(quantity + 1)}
                decrementAction={() => handleQuantityChange(quantity - 1)}
                action={variation.modifiers.length ? showModifiers : null}
              />
            </View>
            <Text
              style={[
                globalStyles.tiny,
                utilStyles.capitalize,
                colorStyles.black,
                utilStyles.textCenter,
              ]}>
              {variation.modifiers.length ? t('customisable') : null}
            </Text>
          </View>
        ) : null}
      </View>
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
    height: 140,
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 10,
  },
  image: {
    width: 120,
    height: 100,
    backgroundColor: COLORS.grey50,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 130,
    height: 60,
    alignItems: 'center',
  },
  stepperContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // minHeight: 24,
  },
  stepperWidth: {width: 100, height: 24},
  foodType: {
    width: 16,
    height: 16,
  },
  nameContainer: {
    flex: 1,
  },
  typeImage: {
    flex: 0.1,
  },
  itemDetails: {
    flex: 0.9,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 12,
  },
});

const equal = (prev: any, next: any) => {
  if (prev.index !== next.index) {
    return false;
  } else if (prev.item?.id !== next.item?.id) {
    return false;
  }
  return true;
};

export default React.memo(VariationCard, equal);