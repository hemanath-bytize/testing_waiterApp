import {PriceCategory, Tables, Variation} from '.';

export interface Cart {
  items: Variation[];
  price: Price;
  price_category: PriceCategory;
  tables: Tables[];
  order: any;
  customer: any;
  custom_attributes: any;
  loading: boolean;
}

export interface Calculation {
  sub_total: number;
  tax: Tax;
  discount: Discount;
  charge: ChargeData;
  total: number;
}

export interface Discount {
  sub_total: number;
  total: number;
  discounts: any[];
}

export interface ChargeData {
  total: number;
  charges: Charge[];
}

export interface Price {
  sub_total: number;
  tax: Tax;
  discount: Discount;
  charge: ChargeData;
  roundOff: number;
  tip: number;
  total: number;
  total_without_tip: number;
}

export interface Tax {
  inclusive: number;
  exclusive: number;
  total: number;
  type: any;
  taxes: Taxes[];
}

export interface Taxes {
  id: number;
  merchant_id: number;
  name: string;
  type: string;
  rate: number;
  is_active: boolean;
  updated_at: string;
  amount: number;
}

export interface Charge {
  name: string;
  type: string;
  value: number;
  id: number;
  applicable_on: string;
  amount: number;
  tax: number;
  taxes: ChargeTax[];
  is_automatic: boolean;
  conditions: Conditions;
}

export interface ChargeTax {
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
