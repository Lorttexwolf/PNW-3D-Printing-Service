"use server";

import { retrieveSafeJWTPayload } from "@/app/api/util/JwtHelper";
import AccountServe from "@/app/Types/Account/AccountServe";
import { NextRequest, NextResponse } from "next/server";

export default async function farmMiddleware(
	request: NextRequest
): Promise<Response> {
	const jwtPayload = await retrieveSafeJWTPayload();
	// Maintainer or above can access the FarmAPI mirror!
	if (jwtPayload == null || jwtPayload.permission == "user")
		return new NextResponse(null, { status: 401 });

	return NextResponse.next();
}
