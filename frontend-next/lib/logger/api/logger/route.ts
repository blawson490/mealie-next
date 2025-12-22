import { NextResponse } from "next/server";
import { logInfo, logError, logWarn, logEvent, logMetric, identify } from "../../actions";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, level, meta, traits, userId, metricName, value, eventName, error } = body;

        switch (level) {
            case "info":
                await logInfo(message, meta);
                break;
            case "warn":
                await logWarn(message, meta);
                break;
            case "error":
                await logError(message, error || message);
                break;
            case "event":
                await logEvent(eventName || message, meta);
                break;
            case "metric":
                await logMetric(metricName, value, meta);
                break;
            case "identify":
                await identify(userId, traits);
                break;
            default:
                await logInfo(message, meta);
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
