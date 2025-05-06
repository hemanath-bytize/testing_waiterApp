import _ from 'lodash';
import {useTranslation} from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import {SheetManager} from 'react-native-actions-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';

import Chip from '../../components/Chip';
import utilStyles from '../../styles/utils';
import COLORS from '../../constants/colors';
import VariationCard from './VariationCard';
import {RootState} from '../../redux/store';
import colorStyles from '../../styles/colors';
import globalStyles from '../../styles/global';
import {resetCart} from '../../redux/slices/cartSlice';
import {
  setCategories,
  setCategory,
  setVariations,
} from '../../redux/slices/waiterSlice';
import {useGetCategoryMutation, useGetItemsMutation} from '../../services/api';
import {
  Categories,
  Category,
  MerchantDetails,
  PriceCategory,
  Table,
  Variations,
} from '../../types';
import {Cart} from '../../types/Cart';
import {defaultVariations, staticIp} from '../../utils/defaults';
function Items({navigation}): JSX.Element {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [getCategoryApi] = useGetCategoryMutation();
  const [getItemsApi] = useGetItemsMutation();
  const server = useSelector(state => state.server);
  const merchantDetails: MerchantDetails = useSelector(
    (state: RootState) => state.server.merchant,
  );
  const categories: Categories = useSelector(
    (state: RootState) => state.waiter.categories,
  );
  const variations: Variations = useSelector(
    (state: RootState) => state.waiter.variations,
  );
  const cart: Cart = useSelector((state: RootState) => state.cart);
  const category: Category | any = useSelector(
    (state: RootState) => state.waiter.selectedCategory,
  );
  const selectedPriceCategory: PriceCategory | any = useSelector(
    (state: RootState) => state.cart.price_category,
  );
  const [showPriceCategory, setShowPriceCategory] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const categoriesScrollView = useRef();

  useEffect(() => {
    return () => {
      dispatch(resetCart({}));
      dispatch(
        setCategory({
          id: null,
          name: 'All',
          no_of_category: 0,
          parent: null,
          is_active: true,
        }),
      );
    };
  }, []);

  const getItems = useCallback(
    ({offset = 0, query = ''}) => {
      if (server.host.ip === staticIp) {
        dispatch(setVariations(defaultVariations));
      } else {
        getItemsApi({
          location_id: merchantDetails.location.id,
          category_id: category.id,
          price_category_id: selectedPriceCategory?.id,
          offset,
          query,
        });
      }
    },
    [
      category.id,
      dispatch,
      getItemsApi,
      merchantDetails.location.id,
      selectedPriceCategory?.id,
      server.host.ip,
    ],
  );

  useEffect(() => {
    if (server.host.ip === staticIp) {
      dispatch(
        setCategories({
          list: [
            {
              id: null,
              name: 'All',
              no_of_category: 0,
              image_url: null,
              is_active: true,
            },
          ],
          offset: 0,
          total: 0,
        }),
      );
    } else {
      getCategoryApi({id: category.id}).then(response => {
        try {
          if (response.data.data) {
            let newList = [...response.data.data.list];
            if (category?.id) {
              if (category.no_of_category > 0) {
                newList.unshift(category);
              } else {
                return;
              }
            } else {
              newList.unshift({
                id: null,
                name: 'All',
                no_of_category: 0,
                image_url: null,
                is_active: true,
              });
            }
            dispatch(setCategories({...response.data.data, list: newList}));
            if (typeof categoriesScrollView.current?.scrollTo === 'function') {
              categoriesScrollView.current.scrollTo({y: 0});
            }
          }
        } catch (err) {
          console.log('err', err);
        }
      });
    }
  }, [category.id, category.no_of_category, dispatch, getCategoryApi]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getItems({});
    });

    return unsubscribe;
  }, [getItems, navigation]);

  useEffect(() => {
    getItems({});
  }, [category?.id, selectedPriceCategory?.id, merchantDetails.location.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        hideWhenScrolling: false,
        onChangeText: (event: any) => {
          getItems({query: event.nativeEvent.text});
        },
      },
    });
  }, [getItems, navigation]);

  const onItemReachEnd = useCallback(() => {
    if (variations.list.length < variations.total) {
      getItems({offset: variations.offset + 20});
    }
  }, [getItems, variations]);

  const renderBackIcon = useCallback((selected: boolean) => {
    return () => (
      <MaterialCommunityIcons
        name="chevron-left"
        size={24}
        color={selected ? COLORS.white : COLORS.primary}
      />
    );
  }, []);

  const renderItems = useCallback(({item, index}) => {
    return (
      <VariationCard
        variation={item}
        index={index}
        disabled={server.host.ip === staticIp}
      />
    );
  }, []);

  const renderEmptyItems = () => (
    <View
      style={[
        utilStyles.flex,
        utilStyles.alignItemsCenter,
        utilStyles.justifyContentCenter,
        utilStyles.pb10,
      ]}>
      {variations.loading ? (
        <ActivityIndicator size={'large'} color={COLORS.primary} />
      ) : (
        <Text style={[globalStyles.p, utilStyles.capitalize]}>
          {t('noItemsFound')}
        </Text>
      )}
    </View>
  );

  const priceCategoryAction = () => {
    SheetManager.show('price-category', {});
  };
  const cartNavigation = () => {
    navigation.navigate('Cart');
  };

  const isPriceCategoryDisabled = () => {
    return cart.tables.reduce((result: boolean, table: Table) => {
      if (table.price_category?.id) {
        result = true;
      }
      return result;
    }, false);
  };
  return (
    <SafeAreaView
      style={[
        utilStyles.flex,
        {
          paddingTop: insets.top * (Platform.OS === 'ios' ? 3 : 1),
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={[utilStyles.pl4, utilStyles.pr4]}>
        <ScrollView
          ref={categoriesScrollView}
          style={styles.category}
          contentContainerStyle={[utilStyles.alignItemsCenter]}
          horizontal>
          {categories.list?.map((c: Category, index: number) => (
            <Chip
              label={c.name}
              index={index}
              action={() => {
                dispatch(
                  setCategory(
                    category?.id === c.id
                      ? c.parent !== null
                        ? c.parent
                        : {
                            id: null,
                            name: 'All',
                            no_of_category: 0,
                            parent: null,
                            is_active: true,
                          }
                      : c,
                  ),
                );
              }}
              selected={c.id === category?.id}
              icon={
                (c.no_of_category > 0 || c.parent != null) &&
                category?.id === c?.id
                  ? renderBackIcon(c.id === category?.id)
                  : null
              }
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={variations.list}
        contentContainerStyle={[
          utilStyles.flexGrow,
          utilStyles.pl4,
          utilStyles.pr4,
          utilStyles.pt2,
          {paddingBottom: 100},
        ]}
        scrollEventThrottle={16}
        renderItem={renderItems}
        scrollToOverflowEnabled
        ListEmptyComponent={renderEmptyItems()}
        onEndReachedThreshold={1}
        onScroll={event => {
          setShowPriceCategory(event.nativeEvent.contentOffset.y < 50);
        }}
        onEndReached={onItemReachEnd}
        numColumns={DeviceInfo.isTablet() ? 2 : 1}
      />
      {cart.items.length ? (
        <Pressable
          onPress={cartNavigation}
          style={[styles.cartContainer, {position: 'absolute', bottom: 0}]}>
          <View
            style={[
              utilStyles.flexRow,
              utilStyles.alignItemsCenter,
              utilStyles.justifyContentBetween,
            ]}>
            <View style={[utilStyles.flexRow]}>
              <Text
                style={[
                  globalStyles.p,
                  colorStyles.white,
                  utilStyles.capitalize,
                  utilStyles.mr1,
                ]}>
                {t(`item_${cart.items.length > 1 ? 'plural' : 'one'}`, {
                  count: cart.items.length,
                })}
              </Text>
              <Text style={[globalStyles.p, colorStyles.white]}>
                |{' '}
                {t('toCurrency', {
                  value: cart.price.total,
                })}
              </Text>
            </View>

            <View style={[utilStyles.flexRow, utilStyles.alignItemsCenter]}>
              <Text
                style={[
                  globalStyles.p,
                  utilStyles.uppercase,
                  colorStyles.white,
                  utilStyles.mr1,
                ]}>
                {t('viewCart')}
              </Text>
              <MaterialCommunityIcons
                name="shopping-outline"
                size={20}
                color={COLORS.white}
              />
            </View>
          </View>
        </Pressable>
      ) : showPriceCategory ? (
        <Pressable
          style={styles.priceCategoryContainer}
          disabled={isPriceCategoryDisabled()}
          onPress={priceCategoryAction}>
          <Text
            style={[
              utilStyles.p,
              colorStyles.white,
              utilStyles.textCenter,
              utilStyles.capitalize,
              utilStyles.px4,
            ]}>
            {selectedPriceCategory
              ? selectedPriceCategory.name
              : t('priceCategory')}
          </Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  category: {
    height: 60,

    flexDirection: 'row',
  },
  priceCategoryContainer: {
    position: 'absolute',
    minWidth: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    elevation: 4,
    bottom: 16,
    // right: 16,
    height: 42,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cartContainer: {
    width: '95%',
    backgroundColor: COLORS.green30,
    margin: 8,
    borderRadius: 12,
    padding: 16,
    alignSelf: 'center',
  },
  loading: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Items;
