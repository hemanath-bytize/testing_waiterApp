import { StyleSheet } from 'react-native';

const styles = {
  h100: {
    height: '100%',
  },
  w100: {
    width: '100%',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  lowercase: {
    textTransform: 'lowercase',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  floatRight: {
    alignSelf: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  alignContentBetween: {
    alignContent: 'space-between',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  absolute: {
    position: 'absolute',
  },
  l0: {
    left: 0,
  },
  r0: {
    right: 0,
  },
};

for (let index = 0; index < 10; index++) {
  const size = index + 1;
  const value = 4 + index * 4;

  styles[`p${size}`] = { padding: value };
  styles[`pt${size}`] = { paddingTop: value };
  styles[`pb${size}`] = { paddingBottom: value };
  styles[`pl${size}`] = { paddingLeft: value };
  styles[`pr${size}`] = { paddingRight: value };
  styles[`px${size}`] = {
    paddingLeft: value,
    paddingRight: value,
  };
  styles[`py${size}`] = {
    paddingTop: value,
    paddingBottom: value,
  };
  styles[`m${size}`] = { margin: value };
  styles[`mt${size}`] = { marginTop: value };
  styles[`mb${size}`] = { marginBottom: value };
  styles[`ml${size}`] = { marginLeft: value };
  styles[`mr${size}`] = { marginRight: value };
  styles[`mx${size}`] = {
    marginLeft: value,
    marginRight: value,
  };
  styles[`my${size}`] = {
    marginTop: value,
    marginBottom: value,
  };
  styles[`br${size}`] = { borderRadius: value };
}

const utilStyles = StyleSheet.create(styles);

export default utilStyles;
