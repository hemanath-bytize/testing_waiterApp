import {registerSheet} from 'react-native-actions-sheet';
import ModifiersSheet from './src/screens/Items/Modifiers';
import PriceCategorySheet from './src/screens/PriceCategory';
import AddCustomer from './src/screens/Customer/AddCustomer';

registerSheet('price-category', PriceCategorySheet);
registerSheet('customer-create', AddCustomer);
registerSheet('item-modifiers', ModifiersSheet);
