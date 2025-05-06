let _navigator: {navigate: (arg0: any, arg1: any) => void; goBack: () => void};

function setTopLevelNavigator(r: any) {
  _navigator = r;
}

function navigate(routeName: any, params: any) {
  _navigator.navigate(routeName, params ? params : null);
}

function back() {
  _navigator.goBack();
}

export default {
  navigate,
  setTopLevelNavigator,
  back,
};
