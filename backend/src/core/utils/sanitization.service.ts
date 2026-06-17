import { Injectable } from '@nestjs/common';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

@Injectable()
export class SanitizationService {
    /**
     * Sanitize HTML content from rich text editors (Quill, etc.)
     * Removes script tags, event handlers, and dangerous attributes
     */
    sanitizeHtml(dirty: string): string {
        if (!dirty) return '';
        return DOMPurify.sanitize(dirty, {
            ALLOWED_TAGS: [
                'p',
                'br',
                'strong',
                'b',
                'em',
                'i',
                'u',
                's',
                'strike',
                'a',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'ul',
                'ol',
                'li',
                'blockquote',
                'pre',
                'code',
                'span',
                'div',
                'img',
                'figure',
                'figcaption',
                'table',
                'thead',
                'tbody',
                'tr',
                'td',
                'th',
                'sub',
                'sup',
                'del',
                'ins',
                'mark',
                'small',
            ],
            ALLOWED_ATTR: [
                'href',
                'title',
                'alt',
                'src',
                'class',
                'id',
                'target',
                'rel',
                'width',
                'height',
                'style',
                'data-*',
            ],
            ALLOW_DATA_ATTR: true,
            FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
            FORBID_TAGS: [
                'script',
                'iframe',
                'object',
                'embed',
                'form',
                'input',
            ],
        });
    }

    /**
     * Strip all HTML tags — useful for plain text fields that shouldn't contain HTML
     */
    stripHtml(html: string): string {
        if (!html) return '';
        return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    }

    /**
     * Sanitize a plain text string to prevent XSS in non-HTML contexts
     */
    escapeHtml(text: string): string {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
