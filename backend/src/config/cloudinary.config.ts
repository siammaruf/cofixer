import { v2 as cloudinary } from 'cloudinary';
import { envConfigService } from './env-config.service';

const config = envConfigService.getCloudinaryConfig();

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
});

export { cloudinary };
