const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config();

const hostsService = {
    getHostsPath: () => {
        // Xác định đường dẫn hosts file dựa trên hệ điều hành
        return os.platform() === 'win32' 
            ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
            : '/etc/hosts';
    },

    addDomain: async (domain) => {
        try {
            const hostsPath = hostsService.getHostsPath();
            const baseDomain = process.env.BASE_DOMAIN;
            const fullDomain = `${domain}.${baseDomain}`;
            const entry = `127.0.0.1 ${fullDomain}\n`;

            // Kiểm tra xem domain đã tồn tại trong hosts chưa
            const hostsContent = fs.readFileSync(hostsPath, 'utf8');
            if (!hostsContent.includes(fullDomain)) {
                // Thêm domain mới vào cuối file
                fs.appendFileSync(hostsPath, entry);
                console.log(`Added ${fullDomain} to hosts file`);
            }

            return true;
        } catch (error) {
            console.error('Error adding domain to hosts:', error);
            throw error;
        }
    },

    removeDomain: async (domain) => {
        try {
            const hostsPath = hostsService.getHostsPath();
            const baseDomain = process.env.BASE_DOMAIN;
            const fullDomain = `${domain}.${baseDomain}`;
            
            // Đọc và lọc bỏ dòng chứa domain cần xóa
            const hostsContent = fs.readFileSync(hostsPath, 'utf8');
            const updatedContent = hostsContent
                .split('\n')
                .filter(line => !line.includes(fullDomain))
                .join('\n');

            fs.writeFileSync(hostsPath, updatedContent);
            console.log(`Removed ${fullDomain} from hosts file`);
            
            return true;
        } catch (error) {
            console.error('Error removing domain from hosts:', error);
            throw error;
        }
    }
};

module.exports = hostsService; 