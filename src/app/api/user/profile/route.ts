import { NextResponse } from "next/server"

// Profile API removed — keep a stub route to satisfy imports and avoid build errors.
export async function GET() {
	return NextResponse.json({ error: "Profile API removed" }, { status: 404 })
}

export async function POST() {
	return NextResponse.json({ error: "Profile API removed" }, { status: 404 })
}

export async function PUT() {
	return NextResponse.json({ error: "Profile API removed" }, { status: 404 })
}

export async function DELETE() {
	return NextResponse.json({ error: "Profile API removed" }, { status: 404 })
}
