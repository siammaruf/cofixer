import { v2 as cloudinary } from 'cloudinary';
import { envConfigService } from './env-config.service';

const config = envConfigService.getCloudinaryConfig();

// Fail fast if Cloudinary credentials are missing in production
if (!config.apiSecret) {
    throw new Error(
        'CLOUDINARY_API_SECRET is missing. Please set it in your environment variables.',
    );
}

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
});

export { cloudinary };
