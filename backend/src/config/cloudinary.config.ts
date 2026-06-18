import { v2 as cloudinary } from 'cloudinary';
import { envConfigService } from './env-config.service';

const config = envConfigService.getCloudinaryConfig();

// Debug: verify Cloudinary config is loaded
console.log('[CLOUDINARY CONFIG] cloud_name:', config.cloudName);
console.log('[CLOUDINARY CONFIG] api_key:', config.apiKey ? '***SET***' : '***MISSING***');
console.log('[CLOUDINARY CONFIG] api_secret:', config.apiSecret ? '***SET***' : '***MISSING***');

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
});

export { cloudinary };
