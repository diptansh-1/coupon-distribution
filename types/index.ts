export interface Coupon {
  code: string;
  description?: string;
}

export interface CouponResponse {
  success: boolean;
  message: string;
  coupon?: Coupon;
  waitTimeMinutes?: number;
  previousCoupon?: string;
} 