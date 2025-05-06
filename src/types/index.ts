import {Calculation} from './Cart';

export interface WaiterInitialState {
  employee: Employee;
  floors: Floor[];
  tables: Tables;
  categories: Categories;
  selectedFloor: Floor | any;
  selectedCategory: Category | any;
  variations: Variations;
  priceCategories: PriceCategories;
  customers: Customers;
  tableOrder: TableOrder;
  settings: any;
  printerIp: string | null;
}

export interface serverInitialState {
  host: any;
  merchant: MerchantDetails | any;
}

export interface Floor {
  id: number;
  merchant_id: number;
  location_id: number;
  name: string;
  custom_attributes: FloorCustomAttributes;
  layout: Layout;
  updated_at: string;
}

export interface FloorCustomAttributes {
  minimum_party_size: string;
  auto_apply_gratuity: boolean;
}

export interface Layout {
  width: string;
  height: string;
}

export interface Tables {
  list: Table[];
  total: number;
  offset: number;
  loading: boolean;
}
export interface Categories {
  list: Category[];
  total: number;
  offset: number;
  loading: boolean;
}

export interface Category {
  id: number | any;
  name: string;
  no_of_category: number;
  parent: any;
  is_active: boolean;
}

export interface Table {
  id: number;
  floor: Floor;
  name: string;
  seats_count: number;
  orders: number;
  price_category: PriceCategory;
  custom_attributes: CustomAttributes;
  layout_attributes: LayoutAttributes;
  is_occupied: boolean;
  status: string;
  updated_at: string;
}

export interface Layout {
  width: string;
  height: string;
}

export interface PriceCategory {
  id: number;
  merchant_id: number;
  price_category_id: any;
  name: string;
  slug: string;
  price_type: string;
  price_value: number;
  taxes: any[];
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  platform: string;
  category_type: string;
  config: any;
  custom_attributes: CustomAttributes;
  is_active: boolean;
  updated_at: string;
}

export interface Label {
  name: string;
  is_required: string;
}

export interface CustomAttributes {}

export interface LayoutAttributes {
  top: string;
  left: string;
  width: string;
  height: string;
  transform: string | any;
  borderRadius: string;
}

export interface Host {
  ip: string;
  port: string;
}

export interface PriceCategories {
  list: PriceCategory[];
  total: number;
  offset: number;
  loading: boolean;
}
export interface Variations {
  list: Variation[];
  total: number;
  offset: number;
  loading: boolean;
}
export interface Variation {
  id: number;
  merchant_id: number;
  taxes: any[];
  name: string;
  description: string;
  image_url: string;
  sku: string;
  hsn: string;
  discounts: any[];
  barcode: string;
  alternate_code: string;
  type: string;
  food_type: string;
  favourite: boolean;
  unit_measure_type: string;
  combo: any;
  modifiers: any[];
  custom_attributes: VariationCustomAttributes;
  is_active: boolean;
  updated_at: string;
  discounted_quantity: number;
  price: number;
  calculation: Calculation;
  apply_before_tax: boolean;
  item: ItemDetail;
  inventory: Inventory;
  groups: any[];
  quantity: number;
  max_quantity: number;
  ordered_quantity: number;
  alternate_name: any;
  item_code: string;
  itemization_type: string;
  sub_total: number;
  tax: number;
  tax_type: any;
  total_discount: number;
  total: number;
  notes: any;
}

export interface Modifier {
  id: number;
  name: string;
  type: string;
  variations: Variation[];
  custom_attributes: ModifierCustomAttributes;
  is_multi_choice: boolean;
  is_required: boolean;
  is_active: boolean;
  updated_at: string;
}

export interface ModifierCustomAttributes {
  max_selectable: string;
  alternate_language: string;
}
export interface Inventory {
  id: number;
  merchant_id: number;
  location_id: number;
  kot_device: any;
  pricing_type: string;
  buying_price: number;
  selling_price: number;
  original_price: number;
  mrp: number;
  quantity_available: number;
  taxes: any[];
  batches: any[];
  track_inventory: boolean;
  online_track_inventory: boolean;
  is_active: boolean;
  updated_at: string;
}
export interface VariationCustomAttributes {
  yield: string;
  max_price: string;
  min_price: string;
  shelf_life: string;
  recommended: string;
  comfort_factor: string;
  weighing_scale: boolean;
  group_conditions: GroupConditions;
  normal_lead_time: string;
  urgent_lead_time: string;
  alternate_language: string;
  track_empty_containers: boolean;
  alternate_language_description: string;
  alternate_uom: string;
  alternate_uom_qty: string;
  alternate_uom_apply_po: boolean;
}
export interface GroupConditions {
  max_selectable: string;
}

export interface MerchantDetails {
  id: number;
  email: string;
  name: string;
  username: string;
  phone: Phone;
  location: Location;
  merchant: Merchant;
  device: Device;
  policies: Policies;
  logoData: string;
}

export interface Phone {
  number: string;
  code: string;
}

export interface Location {
  id: number;
  name: string;
  address: Address;
  custom_attributes: LocationCustomAttributes;
}

export interface Address {
  city: string;
  region: string;
  country: string;
  postal_code: string;
  address_line_1: string;
  address_line_2: string;
}

export interface LocationCustomAttributes {
  crn: string;
  fln: string;
  trn: string;
  crn_label: string;
  fln_label: string;
  trn_label: string;
  delivery_mode: string;
  location_alias: string;
  min_order_value: string;
  min_pickup_time: string;
  order_seq_reset: string;
  order_seq_prefix: string;
  pickup_available: boolean;
  min_delivery_time: string;
  delivery_available: boolean;
  order_delivery_days: string;
  delivery_partner_mode: string;
  max_delivery_distance: string;
}

export interface Merchant {
  id: number;
  m_code: string;
  lead_id: number;
  brand_name: string;
  business_name: string;
  partner: Partner;
  business_type: BusinessType;
  sub_business_type: SubBusinessType;
  timezone: string;
  country_code: string;
  currency_code: string;
  language_code: string;
  logo_url: string;
  custom_attributes: MerchantCustomAttributes;
  business_email: string;
  business_phone: BusinessPhone;
  business_address: BusinessAddress;
  website_url: string;
  settings: Settings;
  features: Features;
  subscription: Subscription;
  platforms: string[];
  business_category: BusinessCategory;
  is_cloud_kitchen: boolean;
  parent_merchant: ParentMerchant;
  child_merchants: any[];
  domains: Domains;
  credit: number;
  transaction_charges: any;
}

export interface Partner {
  id: number;
  name: string;
  slug: string;
}

export interface BusinessType {
  id: number;
  slug: string;
  description: string;
}

export interface SubBusinessType {
  id: number;
  name: string;
  short_name: string;
  custom_attributes: SubBusinessTypeCustomAttributes;
}

export interface SubBusinessTypeCustomAttributes {
  business_types: string;
}

export interface MerchantCustomAttributes {
  crn: string;
  trn: string;
  stages: string[];
  crn_label: string;
  trn_label: string;
  state_code: string;
  account_type: string;
  allow_import: number;
  bank_details: BankDetails;
  business_hours: BusinessHours;
  currency_symbol: string;
  letter_head_img: string;
  whatsapp_number: string;
}

export interface BankDetails {
  bank_code: string;
  bank_name: string;
  account_number: string;
  bank_code_label: string;
}

export interface BusinessHours {
  closing: string;
  opening: string;
}

export interface BusinessPhone {
  number: string;
  calling_code: string;
}

export interface BusinessAddress {
  city: string;
  region: string;
  country: string;
  postal_code: string;
  address_line_1: string;
  address_line_2: string;
}

export interface Settings {
  sale: Sale;
  report: Report;
  barcode: Barcode;
  general: General;
  receipt: Receipt;
  kot_receipt: KotReceipt;
  denominations: Denomination[];
}

export interface Sale {
  custom_sale: string;
  custom_refund: boolean;
  sell_modifiers: boolean;
}

export interface Report {
  timings: Timings;
}

export interface Timings {
  lunch: Timing;
  dinner: Timing;
  breakfast: Timing;
  'evening tiffin': Timing;
}

export interface Timing {
  to: To;
  from: From;
}

export interface To {
  hour: string;
  minutes: string;
}

export interface From {
  hour: string;
  minutes: string;
}
export interface Barcode {
  price: BarcodeData;
  barcode: BarcodeData;
  quantity: BarcodeData;
}

export interface BarcodeData {
  end_index: string;
  start_index: string;
}

export interface General {
  ads_url: string;
  ads_type: string;
  auto_sync: boolean;
  tip_mandatory: boolean;
  invoice_counter: string;
  item_expiration: Timing;
  reprint_receipt: boolean;
  round_off_total: boolean;
  show_item_image: boolean;
  tip_percentages: string[];
  enable_caller_id: boolean;
  invoice_template: string;
  print_brand_name: boolean;
  price_to_quantity: boolean;
  is_table_mandatory: boolean;
  mask_customer_info: boolean;
  daily_report_emails: any[];
  send_sms_after_sale: boolean;
  show_available_cash: boolean;
  multi_employee_kiosk: boolean;
  print_refund_reciept: boolean;
  shift_order_transfer: boolean;
  is_customer_mandatory: boolean;
  show_shipping_details: boolean;
  tax_calculation_phase: string;
  enable_cash_management: boolean;
  enable_customer_pricing: boolean;
  enable_marketing_consent: boolean;
  enable_modifier_quantity: boolean;
  print_alternate_language: boolean;
  show_default_table_layout: boolean;
  capture_customer_signature: boolean;
  cogs_based_on_buying_price: boolean;
  enable_token_number_system: boolean;
  apply_discount_on_each_item: boolean;
  order_sequential_reset_time: string;
  enable_employee_gps_tracking: boolean;
  order_sequential_reset_month: string;
  enable_credit_otp_verification: boolean;
  enable_credit_limit_restriction: boolean;
  print_shift_summary_on_clockout: boolean;
  enable_tracking_empty_containers: boolean;
  enable_inventory_stock_restriction: boolean;
  multi_employee_kiosk_clockout_time: string;
  multi_employee_kiosk_clockout_inactive: boolean;
}

export interface Receipt {
  cin: boolean;
  fln: boolean;
  trn: boolean;
  city: boolean;
  region: boolean;
  address: boolean;
  charges: boolean;
  country: boolean;
  preview: boolean;
  cin_font: string;
  datetime: boolean;
  fln_font: string;
  item_hsn: boolean;
  item_mrp: boolean;
  otp_font: string;
  quantity: boolean;
  trn_font: string;
  item_name: boolean;
  sub_total: boolean;
  tax_total: boolean;
  cart_items: boolean;
  item_price: boolean;
  item_total: boolean;
  logo_width: string;
  total_font: string;
  bill_number: boolean;
  logo_height: string;
  postal_code: boolean;
  tax_message: boolean;
  total_items: boolean;
  website_url: boolean;
  address_font: string;
  charges_font: string;
  company_name: boolean;
  item_barcode: boolean;
  phone_number: boolean;
  address_line1: boolean;
  address_line2: boolean;
  customer_code: boolean;
  customer_name: boolean;
  datetime_font: string;
  discount_font: string;
  balance_amount: boolean;
  customer_phone: boolean;
  footer_message: boolean;
  header_message: boolean;
  invoice_number: boolean;
  payment_method: boolean;
  receipt_header: boolean;
  sub_total_font: string;
  tax_total_font: string;
  total_quantity: boolean;
  cart_items_font: string;
  print_signature: boolean;
  bill_number_font: string;
  customer_address: boolean;
  employee_details: boolean;
  posbytz_branding: boolean;
  tax_message_text: string;
  website_url_font: string;
  company_name_font: string;
  item_tax_split_up: boolean;
  phone_number_font: string;
  credit_amount_font: string;
  customer_code_font: string;
  customer_name_font: string;
  customer_trn_label: string;
  print_cash_summary: boolean;
  print_item_summary: boolean;
  customer_phone_font: string;
  footer_message_font: string;
  footer_message_text: string;
  header_message_font: string;
  header_message_text: string;
  invoice_number_font: string;
  payment_method_font: string;
  print_brand_summary: boolean;
  print_shift_summary: boolean;
  receipt_header_text: string;
  online_order_id_font: string;
  print_charge_summary: boolean;
  print_credit_summary: boolean;
  print_refund_summary: boolean;
  customer_address_font: string;
  discount_against_item: string;
  employee_details_font: string;
  print_channel_summary: boolean;
  print_payment_summary: boolean;
  item_discount_split_up: boolean;
  print_employee_summary: boolean;
  outstanding_amount_font: string;
  print_items_alpha_order: boolean;
  amount_saved_on_mrp_font: string;
  discount_against_item_font: string;
  print_denomination_summary: boolean;
  empty_container_details_font: string;
  print_price_category_summary: boolean;
  duplicate_receipt_header_text: string;
  print_foreign_currency_summary: boolean;
  print_category_wise_item_summary: boolean;
}

export interface KotReceipt {
  date: boolean;
  table: boolean;
  number: boolean;
  date_font: string;
  items_font: string;
  table_font: string;
  title_font: string;
  number_font: string;
  waiter_name: boolean;
  customer_name: boolean;
  invoice_number: boolean;
  price_category: boolean;
  restaurant_name: boolean;
  waiter_name_font: string;
  customer_name_font: string;
  invoice_number_font: string;
  price_category_font: string;
  online_order_id_font: string;
  restaurant_name_font: string;
}

export interface Denomination {
  type: string;
  amount: number;
}

export interface Features {}

export interface Subscription {
  tax: number;
  name: string;
  slug: string;
  total: number;
  period: string;
  end_date: string;
  products: Products;
  sub_total: number;
  start_date: string;
  description: string;
  currency_code: string;
  original_end_date: string;
  limitations: any;
  status: Status;
  invoice_status: string;
}

export interface Products {
  items: Product;
  loyalty: Product;
  discount: Product;
  employee: Product;
  location: Product;
  referral: Product;
  bandwidth: Product;
  restaurant: Product;
  waiter_app: Product;
  qr_ordering: Product;
  chat_support: Product;
  delivery_app: Product;
  integrations: Product;
  online_store: Product;
  email_support: Product;
  phone_support: Product;
  advanced_report: Product;
  kitchen_display: Product;
  report_download: Product;
  own_brand_domain: Product;
  priority_support: Product;
  advanced_discount: Product;
  own_brand_ios_app: Product;
  pos_device_license: Product;
  purchase_inventory: Product;
  own_brand_android_app: Product;
  store_theme_customization: Product;
  online_store_owner_android_ios: Product;
}

export interface Product {
  id: number;
  qty: number;
  name: string;
  slug: string;
  limit: number;
  period: string;
  identifier: string;
  description: string;
  product_type: string;
  subscribed_qty: number;
}

export interface Status {
  id: number;
  name: string;
  short_name: string;
  custom_attributes: any;
}

export interface BusinessCategory {
  id: number;
  name: string;
  short_name: string;
  custom_attributes: any;
}

export interface ParentMerchant {}

export interface Domains {
  custom_domain: CustomDomain;
  default_domain: DefaultDomain;
}

export interface CustomDomain {
  domain: string;
  active: boolean;
}

export interface DefaultDomain {
  domain: string;
  active: boolean;
  validation_token: any;
}

export interface Device {
  id: number;
  name: string;
  ref_code_prefix: string;
  is_primary: boolean;
  expiry_date: any;
}

export interface Policies {
  item: string[];
  report: string[];
  account: string[];
  credits: string[];
  loyalty: string[];
  'api-keys': string[];
  customer: string[];
  employee: string[];
  reportv2: string[];
  appPolicy: AppPolicy;
  inventory: string[];
  marketing: string[];
  'store-cms': string[];
  accounting: string[];
  'item-taxes': string[];
  'bulk-orders': string[];
  'export-file': string[];
  'import-file': string[];
  'item-brands': string[];
  'item-charges': string[];
  transactions: string[];
  communication: string[];
  'inventory-grn': string[];
  'inventory-log': string[];
  'online-orders': string[];
  'store-banners': string[];
  'account-delete': string[];
  'customer-items': string[];
  'employee-roles': string[];
  'item-discounts': string[];
  'printer-labels': string[];
  'store-settings': string[];
  'account-devices': string[];
  'customer-groups': string[];
  'item-categories': string[];
  'opening-balance': string[];
  'customer-credits': string[];
  'inventory-indent': string[];
  'inventory-report': string[];
  'account-locations': string[];
  'employee-activity': string[];
  'inventory-credits': string[];
  'inventory-history': string[];
  'inventory-vendors': string[];
  'restaurant-floors': string[];
  'restaurant-tables': string[];
  'cash-drawer-events': string[];
  'cash-drawer-shifts': string[];
  'inventory-preparation': string[];
  'item-price-categories': string[];
  'notification-templates': string[];
  'account-pg-integrations': string[];
  'inventory-vendor-return': string[];
  'inventory-purchase-order': string[];
  'inventory-transfer-order': string[];
  'inventory-inventory-count': string[];
  'merchant-attribute-values': string[];
  'accounting-account-mapping': string[];
  'inventory-waste-management': string[];
  'accounting-chart-of-accounts': string[];
  'account-delivery-integrations': string[];
  'account-einvoice-integrations': string[];
  'accounting-accounting-reports': string[];
  'account-marketing-integrations': string[];
  'accounting-accounting-expenses': string[];
  'account-accounting-integrations': string[];
  'accounting-accounting-dashboard': string[];
  'account-merchant-payment-methods': string[];
  'account-online_store-integrations': string[];
  'account-communication-integrations': string[];
}

export interface AppPolicy {
  cart: string[];
  sell: string[];
  sales: string[];
  tables: string[];
  reports: string[];
  settings: string[];
  customers: string[];
  cash_management: string[];
  online_platform: string[];
}

export interface Customers {
  list: Customer[];
  total: number;
  offset: number;
  loading: boolean;
}

export interface Customer {
  id: number;
  merchant_id: number;
  customer_id: number;
  group?: Group;
  first_name: string;
  last_name: string;
  code: string;
  email: string;
  phone: string;
  calling_code: string;
  address: Address;
  credits: number;
  debits: number;
  gender: string;
  dob?: string;
  credit_limit: number;
  reward_points: number;
  custom_attributes: CustomerCustomAttributes;
  is_active: boolean;
  updated_at: string;
}

export interface Group {
  id: number;
  merchant_id: number;
  description: string;
  slug: string;
  is_active: boolean;
  updated_at: string;
}

export interface Address {
  zip?: string;
  area?: string;
  city?: string;
  line?: string;
  state?: string;
  country?: string;
  landmark?: string;
  coordinates?: any[];
  scalar?: string;
}

export interface CustomerCustomAttributes {
  trn?: string;
  company_name?: string;
  telephone_number?: string;
  address?: any[];
  channel?: string;
  scalar?: string;
}

export interface Employee {
  id: number;
  merchant_id: number;
  name: string;
  type: string;
  username: string;
  email: string;
  phone: string;
  calling_code: string;
  passkey: number;
  policy: Policies;
  locations: any[];
  custom_attributes: MerchantCustomAttributes;
  is_admin: boolean;
  is_active: boolean;
  updated_at: string;
}

export interface TableOrder {
  list: Order[];
  total: number;
  offset: number;
  loading: boolean;
}

export interface Order {
  id: number;
  order_id: any;
  employee_shift: EmployeeShift;
  created_by: Employee;
  channel: any;
  status: string;
  receipt_code: string;
  price_category: PriceCategory;
  items: Variation[];
  tables: Table[];
  customer: any;
  payment_method: any;
  order_payments: any[];
  sub_total: number;
  tax: number;
  inclusive_tax: number;
  exclusive_tax: number;
  taxes: Tax[];
  charge: number;
  charges: Charge[];
  total_discount: number;
  discounts: any[];
  round_off: number;
  total: number;
  total_quantity: number;
  total_ordered_quantity: number;
  refunded_quantity: number;
  refunded_amount: number;
  refunded_tax: number;
  tendered_amount: number;
  balance_returned: number;
  notes: string;
  custom_attributes: OrderCustomAttributes;
  tip: number;
  refunds: any[];
  is_synced: boolean;
  KOTHistory: Kothistory[];
  selected: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeShift {
  id: number;
  merchant_id: number;
  location_id: number;
  employee: Employee;
  shift_code: string;
  clock_in_at: string;
  clock_out_at: any;
  is_synced: boolean;
  updated_at: string;
}

export interface ItemDetail {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface Inventory {
  id: number;
  kot_device: any;
  pricing_type: string;
  buying_price: number;
  selling_price: number;
  mrp: number;
  taxes: any[];
  batches: any[];
}

export interface GroupConditions {
  max_selectable: string;
}

export interface Tax {
  id: number;
  name: string;
  amount: number;
  rate: number;
  type: string;
}

export interface Charge {
  name: string;
  type: string;
  value: number;
  id: number;
  applicable_on: string;
  amount: number;
  tax: number;
  taxes: Taxes[];
  is_automatic: boolean;
  conditions: Conditions;
}

export interface Taxes {
  id: number;
  merchant_id: number;
  name: string;
  type: string;
  rate: number;
  is_active: boolean;
  updated_at: string;
  tax_amount: number;
  tax_id: number;
  tax_rate: number;
  tax_name: string;
}

export interface Conditions {
  subtotal: Subtotal[];
}

export interface Subtotal {
  value: number;
  operator: string;
}

export interface OrderCustomAttributes {
  kot_items: KotItem[];
  loyalty_points: LoyaltyPoints;
}

export interface KotItem {
  id: number;
  kot_id: number;
  kot_device_id: any;
  item_code: string;
  unit_measure_type: string;
  item_variation_id: number;
  item_variation_name: string;
  alternate_name: any;
  groups: any[];
  notes: any;
  created_at: string;
  status: string;
  updated_at: string;
  quantity: number;
  status_history: StatusHistory[];
}

export interface StatusHistory {
  id: number;
  status: string;
  created_at: string;
}

export interface LoyaltyPoints {
  redeemable_points: number;
  applied: boolean;
  discounts: any[];
}

export interface Kothistory {
  id: number;
  kot_id: number;
  kot_device: any;
  kot_device_id: any;
  item_code: string;
  item_variation_id: number;
  item_variation_name: string;
  alternate_name: any;
  unit_measure_type: string;
  status: string;
  cancellation_reason: any;
  quantity: number;
  groups: any[];
  status_history: StatusHistory[];
  created_at: string;
  updated_at: string;
}
