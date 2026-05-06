import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { filename } = await params;
        
        // Cari gambar di folder backend
        const backendImagePath = path.join(process.cwd(), '..', 'RS4API-backend', 'static', 'images', 'doctors', filename);
        // Juga cek di folder frontend static sebagai fallback
        const frontendImagePath = path.join(process.cwd(), 'static', 'images', 'doctors', filename);
        
        let imagePath = null;
        if (fs.existsSync(backendImagePath)) {
            imagePath = backendImagePath;
        } else if (fs.existsSync(frontendImagePath)) {
            imagePath = frontendImagePath;
        }
        
        if (!imagePath) {
            // Return 404 jika gambar tidak ditemukan
            return new NextResponse('Image not found', { status: 404 });
        }
        
        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(filename).toLowerCase();
        
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
        };
        
        const contentType = mimeTypes[ext] || 'image/jpeg';
        
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // Cache 1 hari
            }
        });
    } catch (error) {
        return new NextResponse('Image not found', { status: 404 });
    }
}
