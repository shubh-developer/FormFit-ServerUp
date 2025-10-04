import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { query } from '@/lib/database';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { username, fullName, email, password, role, contactNumber, address, photoUrl, panCard, aadharCard } = await request.json();
    const { id } = params;

    let updateQuery = `
      UPDATE admin_users 
      SET username = $1, full_name = $2, email = $3, role = $4, contact_number = $5, address = $6, photo_url = $7, pan_card = $8, aadhar_card = $9
      WHERE id = $10
    `;
    let queryParams = [username, fullName, email, role, contactNumber, address, photoUrl, panCard, aadharCard, id];

    // If password is provided, update it too
    if (password) {
      const hashedPassword = hashPassword(password);
      updateQuery = `
        UPDATE admin_users 
        SET username = $1, full_name = $2, email = $3, password_hash = $4, role = $5, contact_number = $6, address = $7, photo_url = $8, pan_card = $9, aadhar_card = $10
        WHERE id = $11
      `;
      queryParams = [username, fullName, email, hashedPassword, role, contactNumber, address, photoUrl, panCard, aadharCard, id];
    }

    await query(updateQuery, queryParams);

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update admin'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await query('DELETE FROM admin_users WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete admin'
    }, { status: 500 });
  }
}