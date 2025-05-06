import _, {capitalize} from 'lodash';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Chip from '../../components/Chip';
import utilStyles from '../../styles/utils';
import COLORS from '../../constants/colors';
import colorStyles from '../../styles/colors';
import globalStyles from '../../styles/global';
import {setFloor, setFloors, updateTable} from '../../redux/slices/waiterSlice';
import {Employee, Floor, Table, Tables as TableData} from '../../types';
import {
  useGetFloorsMutation,
  useGetTableOrdersMutation,
  useGetTablesMutation,
  useTableStatusUpdateMutation,
} from '../../services/api';
import {
  resetCart,
  setPriceCategory,
  setTables,
} from '../../redux/slices/cartSlice';
import DeviceInfo from 'react-native-device-info';
import {defaultFloors, defaultTables, staticIp} from '../../utils/defaults';

function Tables({navigation}): JSX.Element {
  const {t} = useTranslation();
  const server = useSelector(state => state.server);
  const dispatch = useDispatch();
  const [getFoorsApi] = useGetFloorsMutation();
  const floors: Floor[] = useSelector((state: any) => state.waiter.floors);
  const employee: Employee = useSelector((state: any) => state.waiter.employee);
  const tables: TableData = useSelector((state: any) => state.waiter.tables);
  const selectedFloor = useSelector((state: any) => state.waiter.selectedFloor);
  const [getTablesApi] = useGetTablesMutation();
  const [getTableOrderApi] = useGetTableOrdersMutation();
  const [tableStatusUpdateApi] = useTableStatusUpdateMutation();
  const [processing, setProcessing] = useState(false);
  const [floorWidth, setFloorWidth] = useState(0);
  const [floorHeight, setFloorHeight] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <>
            <Pressable
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('Passcode');
              }}>
              <Text style={styles.clockOut}>
                {capitalize(t('clockOut.title'))}
              </Text>
            </Pressable>
            <MaterialCommunityIcons
              name="cog"
              size={24}
              color={COLORS.primary}
              onPress={() => {
                console.log('onPress');
                navigation.navigate('Settings');
              }}
            />
          </>
        );
      },
    });
  }, [navigation]);

  const getFloors = useCallback(() => {
    if (server.host.ip === staticIp) {
      dispatch(setFloors(defaultFloors.list));
      dispatch(setFloor(defaultFloors.list[0]));
    } else {
      getFoorsApi({});
    }
  }, [dispatch, getFoorsApi, server.host.ip]);

  useEffect(() => {
    getFloors();
  }, [getFloors]);

  useEffect(() => {
    if (tables.list) {
      const dynamicHeight = tables.list.reduce((height, tableItem) => {
        const totalHeight =
          Number(
            tableItem.layout_attributes?.height?.replace('px', '') || 100,
          ) + Number(tableItem.layout_attributes?.top?.replace('px', '') || 0);
        if (totalHeight > height) {
          height = totalHeight;
        }
        return height;
      }, parseInt(selectedFloor?.layout?.height) || 63);
      const dynamicWidth = tables.list.reduce(
        (accumulator, tableItem) => {
          const left = Number(
            tableItem.layout_attributes?.left?.replace('px', '') || 0,
          );

          const width = Number(
            tableItem.layout_attributes?.width?.replace('px', '') || 75,
          );

          accumulator.maxLeft = Math.max(accumulator.maxLeft, left);

          accumulator.totalWidth += width;

          return accumulator;
        },
        {
          maxLeft: 0,
          totalWidth: parseInt(selectedFloor?.layout?.width) || 0,
        },
      );
      const finalFloorWidth = Math.max(
        dynamicWidth.maxLeft,
        dynamicWidth.totalWidth,
      );
      setFloorHeight(dynamicHeight);
      setFloorWidth(finalFloorWidth);
    }
  }, [tables, selectedFloor]);

  const focusEvent = useCallback(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(resetCart({}));
    });

    return unsubscribe;
  }, [dispatch, navigation]);

  useEffect(() => {
    focusEvent();
  }, [focusEvent]);

  const getTables = useCallback(() => {
    if (server.host.ip === staticIp) {
      dispatch(updateTable({...defaultTables}));
    } else {
      getTablesApi({floor_id: selectedFloor?.id});
    }
  }, [dispatch, getTablesApi, selectedFloor?.id, server.host.ip]);

  useEffect(() => {
    if (selectedFloor?.id) {
      getTables();
    }
  }, [getTables, selectedFloor?.id]);

  const onPressHandler = async (table: Table) => {
    if (!processing && table.status !== 'blocked') {
      setProcessing(true);

      const response =
        server.host.ip === staticIp
          ? {
              data: {
                data: {
                  total: 0,
                },
              },
            }
          : await getTableOrderApi({
              table_id: table.id,
              offset: 0,
            });
      if (response?.data?.data?.total) {
        navigation.navigate('Orders', {
          table,
          waiter_id: employee.id,
        });
        if (!table.is_occupied) {
          updateTableStatus(table, true);
        }
      } else {
        dispatch(setPriceCategory(table.price_category));
        dispatch(setTables([table]));
        navigation.navigate('Items');
        if (table.is_occupied) {
          updateTableStatus(table, false);
        }
      }
      _.delay(() => {
        setProcessing(false);
      }, 500);
    }
  };

  const updateTableStatus = (table: Table, status: boolean) => {
    const action = {
      ...tables,
      list: tables.list.map(tl => {
        if (tl.id === table.id) {
          return {...tl, is_occupied: status};
        }

        return tl;
      }),
    };

    dispatch(updateTable(action));
  };

  const onLongPressHandler = (table: Table) => {
    Alert.alert(
      capitalize(
        t(`tableStatus.${table.status === 'blocked' ? 'unblock' : 'block'}`, {
          value: table.name,
        }),
      ),
      capitalize(t('tableStatus.message')),
      [
        {
          text: capitalize(t('no')),
          style: 'destructive',
          onPress: () => {
            console.log('close');
          },
        },
        {
          text: capitalize(t('yes')),
          style: 'cancel',
          onPress: () => {
            tableStatusUpdateApi({
              ...table,
              status: table.status === 'blocked' ? 'free' : 'blocked',
            })
              .then(response => {
                console.log('block table response', JSON.stringify(response));
              })
              .catch(error => {
                console.log('table update error', error);
              })
              .finally(() => {
                getTables();
              });
          },
        },
      ],
    );
  };

  const renderTable = (table: any) => {
    return (
      <Pressable
        onPress={() => onPressHandler(table)}
        onLongPress={() => onLongPressHandler(table)}
        style={styles.tableLayout}>
        <View
          style={[
            styles.tableContainer,
            {
              backgroundColor:
                table.status === 'blocked'
                  ? 'gray'
                  : table.status === 'occupied'
                  ? 'red'
                  : table.status === 'billed'
                  ? 'yellow'
                  : 'green',
            },
          ]}>
          <Text
            style={[
              styles.tableName,
              {color: table.status === 'billed' ? 'black' : 'white'},
            ]}>
            {table.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderFloor = ({item}) => {
    return (
      <Chip
        label={item.name}
        action={() => {
          if (item.id == selectedFloor.id) {
            getTables();
          } else {
            dispatch(setFloor(item));
          }
        }}
        selected={item.id === selectedFloor?.id}
      />
    );
  };

  return (
    <SafeAreaView style={[utilStyles.flex]}>
      <View style={[utilStyles.flex]}>
        <View>
          <FlatList
            data={floors}
            renderItem={renderFloor}
            keyExtractor={item => item.id.toString()}
            style={styles.floors}
            contentContainerStyle={[utilStyles.alignItemsCenter]}
            horizontal
          />
        </View>
        <View style={[styles.tableItems, styles.tableLayoutConatiner]}>
          <FlatList
            data={tables.list}
            numColumns={DeviceInfo.isTablet() ? 6 : 2}
            renderItem={table => renderTable(table.item)}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View
          style={[
            utilStyles.m4,
            colorStyles.bgWhite,
            utilStyles.p4,
            utilStyles.br2,
          ]}>
          <View style={[utilStyles.flexRow, utilStyles.alignItemsCenter]}>
            <View
              style={[
                utilStyles.flexRow,
                utilStyles.alignItemsCenter,
                utilStyles.ml4,
              ]}>
              <View
                style={[styles.status, colorStyles.bgGreen30, utilStyles.mr2]}
              />
              <Text style={[globalStyles.p, utilStyles.capitalize]}>
                {t('free')}:{' '}
                {tables.list.filter(table => table.status === 'free').length}
              </Text>
            </View>
            <View
              style={[
                utilStyles.flexRow,
                utilStyles.alignItemsCenter,
                utilStyles.ml4,
              ]}>
              <View
                style={[styles.status, colorStyles.bgRed, utilStyles.mr2]}
              />
              <Text style={[globalStyles.p, utilStyles.capitalize]}>
                {t('occupied')}:{' '}
                {tables.list.filter(table => table.is_occupied).length}
              </Text>
            </View>
            <View
              style={[
                utilStyles.flexRow,
                utilStyles.alignItemsCenter,
                utilStyles.ml4,
              ]}>
              <View
                style={[styles.status, colorStyles.bgGrey, utilStyles.mr2]}
              />
              <Text style={[globalStyles.p, utilStyles.capitalize]}>
                {t('blocked')}:{' '}
                {tables.list.filter(table => table.status === 'blocked').length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  floors: {
    height: 60,
    paddingStart: 16,
    flexDirection: 'row',
  },
  floorButton: {
    backgroundColor: COLORS.grey,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    minWidth: 100,
    height: 40,
    borderRadius: 50,
  },
  scrollContainer: {flex: 1},
  tableContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    flexDirection: 'row',
    width: '100%',
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seat: {
    backgroundColor: COLORS.grey,
    height: 4,
    borderRadius: 50,
  },
  seatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  listContent: {
    width: '100%',
    justifyContent: 'space-between',
  },
  tableItems: {
    paddingHorizontal: 10,
    paddingTop: 20,
    flexDirection: 'row',
    width: '100%',
  },
  tableLayout: {
    flex: 1,
    padding: 8,
  },
  tableName: {
    fontSize: 14,
    textTransform: 'capitalize',
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
  },
  clockOut: {
    textTransform: 'uppercase',
    color: COLORS.primary,
    fontWeight: '700',
  },
  status: {width: 10, height: 10, borderRadius: 100, marginRight: 4},
  tableLayoutConatiner: {
    height: '80%',
  },
});

export default Tables;