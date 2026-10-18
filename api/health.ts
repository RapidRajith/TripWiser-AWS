export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'TripWise Serverless API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
