import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const CLAIM_COOLDOWN_MINUTES = parseInt(process.env.CLAIM_COOLDOWN_MINUTES || '60', 10);

export async function POST(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Get session ID from cookies using request
    let sessionId = request.cookies.get('session_id')?.value;
    
    // Create a response object that we'll return at the end
    let response: NextResponse;
    
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Check for previous claims within cooldown period
    const cooldownPeriod = new Date();
    cooldownPeriod.setMinutes(cooldownPeriod.getMinutes() - CLAIM_COOLDOWN_MINUTES);

    const recentClaim = await prisma.couponClaim.findFirst({
      where: {
        OR: [
          { ipAddress },
          { sessionId }
        ],
        claimedAt: {
          gte: cooldownPeriod
        }
      },
      include: {
        coupon: true
      }
    });

    if (recentClaim) {
      // Calculate time remaining before another claim can be made
      const claimTime = new Date(recentClaim.claimedAt);
      const nextClaimTime = new Date(claimTime);
      nextClaimTime.setMinutes(nextClaimTime.getMinutes() + CLAIM_COOLDOWN_MINUTES);
      
      const waitTimeMinutes = Math.ceil((nextClaimTime.getTime() - Date.now()) / (1000 * 60));
      
      response = NextResponse.json({
        success: false,
        message: `You have already claimed a coupon recently. Please wait ${waitTimeMinutes} minute(s) before claiming another.`,
        waitTimeMinutes,
        previousCoupon: recentClaim.coupon.code
      }, { status: 429 });
      
      // No need to set a cookie if they already have one
      return response;
    }

    // Get next available coupon using round-robin approach
    const lastClaim = await prisma.couponClaim.findFirst({
      orderBy: {
        claimedAt: 'desc'
      },
      include: {
        coupon: true
      }
    });

    // Find all active coupons
    const activeCoupons = await prisma.coupon.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        code: 'asc'
      }
    });

    if (activeCoupons.length === 0) {
      response = NextResponse.json({ 
        success: false, 
        message: 'No coupons available at this time.'
      }, { status: 404 });
      
      // No need to set a cookie if there are no coupons
      return response;
    }

    // Determine next coupon using round-robin
    let nextCouponIndex = 0;
    if (lastClaim) {
      const lastCouponIndex = activeCoupons.findIndex(c => c.id === lastClaim.coupon.id);
      nextCouponIndex = (lastCouponIndex + 1) % activeCoupons.length;
    }

    const selectedCoupon = activeCoupons[nextCouponIndex];

    // Create a new claim
    const claim = await prisma.couponClaim.create({
      data: {
        couponId: selectedCoupon.id,
        ipAddress,
        userAgent,
        sessionId
      },
      include: {
        coupon: true
      }
    });

    response = NextResponse.json({
      success: true,
      message: 'Coupon claimed successfully!',
      coupon: {
        code: claim.coupon.code,
        description: claim.coupon.description
      }
    });
    
    // Set the cookie if it doesn't exist
    if (!request.cookies.get('session_id')) {
      response.cookies.set({
        name: 'session_id',
        value: sessionId,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error claiming coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim coupon' },
      { status: 500 }
    );
  }
} 