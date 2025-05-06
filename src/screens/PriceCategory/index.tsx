import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions, FlatList, View, StyleSheet} from 'react-native';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';

import utilStyles from '../../styles/utils';
import {RootState} from '../../redux/store';
import COLORS from '../../constants/colors';
import {staticIp} from '../../utils/defaults';
import PriceCategoryCard from './PriceCategoryCard';
import {PriceCategories, PriceCategory} from '../../types';
import {useGetPriceCategoryMutation} from '../../services/api';
import {setPriceCategory} from '../../redux/slices/cartSlice';

function PriceCategorySheet(props): JSX.Element {
  const dispatch = useDispatch();
  const server = useSelector(state => state.server);
  const [getPriceCategoryApi] = useGetPriceCategoryMutation();
  const priceCategories: PriceCategories = useSelector(
    (state: RootState) => state.waiter.priceCategories,
  );
  const selectedPriceCategory: PriceCategory | any = useSelector(
    (state: RootState) => state.cart.price_category,
  );
  useEffect(() => {
    if (server.host.ip === staticIp) {
      dispatch(
        setPriceCategory({
          list: [],
          loading: false,
          offset: 0,
          total: 0,
        }),
      );
    } else {
      getPriceCategoryApi({});
    }
  }, [getPriceCategoryApi]);

  const renderCategory = useCallback(
    ({item, index}: {item: PriceCategory; index: number}) => {
      return (
        <PriceCategoryCard
          priceCategory={item}
          index={index}
          cardStyle={styles.item}
          selected={item.id === selectedPriceCategory?.id}
          action={() => {
            dispatch(
              setPriceCategory(
                item.id === selectedPriceCategory?.id ? null : item,
              ),
            );
            SheetManager.hide(props.sheetId);
          }}
        />
      );
    },
    [dispatch, props.sheetId, selectedPriceCategory?.id],
  );
  return (
    <ActionSheet id={props.sheetId} snapPoints={[100]}>
      <View>
        <FlatList
          data={priceCategories.list}
          contentContainerStyle={[utilStyles.flexGrow]}
          numColumns={3}
          renderItem={renderCategory}
          style={utilStyles.p4}
          columnWrapperStyle={styles.columnWrapper}
          getItemLayout={(data, index) => ({
            length: getItemWidth(),
            offset: getItemWidth() * index,
            index,
          })}
          // scrollToOverflowEnabled
          // ListEmptyComponent={renderEmptyItems()}
          // onEndReachedThreshold={1}
          // onEndReached={onItemReachEnd}
          // ListFooterComponent={<Pagination list={props.items} />}
        />
      </View>
    </ActionSheet>
  );
}

const spacing = 4;

const getItemWidth = () => {
  const screenWidth = Dimensions.get('window').width - 16;
  const totalSpacing = (spacing - 1) * 10;
  return (screenWidth - totalSpacing) / 3;
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing,
  },
  columnWrapper: {
    marginHorizontal: -4 / 3,
    // backgroundColor: '#ff9',
    marginVertical: -4 / 3,
  },
  item: {
    width: getItemWidth(),
    paddingHorizontal: spacing,
    paddingVertical: spacing,
    elevation: 4,
    height: 30,
    backgroundColor: COLORS.white,
    marginBottom: 8,
    marginStart: spacing,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PriceCategorySheet;
