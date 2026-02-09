import { Injectable } from '@nestjs/common';

/**
 * Mock LLM Service for initial implementation
 * Later this will be replaced with actual OpenAI/Gemini integration
 */
@Injectable()
export class LlmService {
    /**
     * Generate AI response based on user message
     * Currently returns mock responses
     */
    async generateResponse(userMessage: string, context?: {
        userName?: string;
        previousMessages?: Array<{ role: string; content: string }>;
    }): Promise<string> {
        // Normalize message for pattern matching
        const msg = userMessage.toLowerCase().trim();

        // Greeting patterns
        if (msg.match(/(hello|hi|xin chào|chào|morning|afternoon|evening)/)) {
            return `Xin chào ${context?.userName || 'bạn'}! 👋 Tobi rất vui được gặp bạn. Hôm nay bạn muốn học gì nào?`;
        }

        // Gratitude
        if (msg.match(/(cảm ơn|thank|thanks|ok|tuyệt|hay quá|good)/)) {
            return 'Rất vui được giúp bạn! Chúc bạn học thật hiệu quả nhé! 🌟 Nếu cần thêm gì cứ ới Tobi nha!';
        }

        // Difficulty/Help
        if (msg.match(/(khó|help|không hiểu|giúp|cứu|bí|confusion)/)) {
            return 'Bình tĩnh nào bạn ơi! 🧘‍♂️\n\nHọc tiếng Anh là một hành trình dài. Nếu gặp câu khó:\n1. Hít thở sâu\n2. Đọc kỹ lại từ khóa\n3. Dùng phương pháp loại trừ\n\nBạn đang mắc ở phần nào? Ngữ pháp hay Từ vựng?';
        }

        // Vocabulary & Flashcards
        if (msg.match(/(từ vựng|vocab|từ mới|flashcard|quên từ)/)) {
            return 'Từ vựng là chìa khóa của TOEIC đấy! 🗝️\n\n👉 Bạn nên vào mục "Flashcards" để ôn tập theo phương pháp lặp lại ngắt quãng (SRS) nhé.\n👉 Mỗi ngày học 10 từ mới là tháng sau pro ngay!';
        }

        // Practice Tests
        if (msg.match(/(đề|test|thi thử|luyện đề|full test)/)) {
            return 'Muốn điểm cao thì phải luyện đề! 📝\n\nBạn có thể vào mục "Tests" để làm:\n- Full Test (2 tiếng giống thi thật)\n- Mini Test (ngắn gọn, tranh thủ làm)\n\nCố gắng canh thời gian chuẩn nhé!';
        }

        // Grammar
        if (msg.match(/(ngữ pháp|grammar|cấu trúc|thì|tense)/)) {
            return 'Ngữ pháp TOEIC thường xoay quanh:\n1. Các thì cơ bản (Hiện tại đơn, Quá khứ, Tương lai)\n2. Loại từ (Danh, Động, Tính, Trạng)\n3. Câu bị động & Mệnh đề quan hệ\n\nBạn cần Tobi giải thích phần nào không?';
        }

        // Listening tips
        if (msg.match(/(nghe|listening|part 1|part 2|part 3|part 4)/)) {
            return 'Mẹo luyện nghe nè: 👂\n- Part 1: Quan sát kỹ hành động/trạng thái trong tranh\n- Part 2: Tập trung nghe từ để hỏi (Who, Where, When...)\n- Part 3 & 4: Đọc trước câu hỏi để bắt keyword\n\nQuan trọng nhất là Luyện nghe hàng ngày nhé!';
        }

        // Reading tips
        if (msg.match(/(đọc|reading|part 5|part 6|part 7)/)) {
            return 'Mẹo luyện đọc nhé: 📚\n- Part 5 & 6: Học kỹ ngữ pháp và loại từ để chọn siêu tốc\n- Part 7: Đừng dịch hết bài! Đọc câu hỏi trước, rồi tìm thông tin (Scanning & Skimming)\n\nCố lên, kiên trì là sẽ lên điểm!';
        }

        // Motivation
        if (msg.match(/(nản|mệt|buồn|chán|điểm thấp)/)) {
            return 'Đừng buồn nhé! Ai cũng có lúc bắt đầu và lúc khó khăn mà. 🤗\n\n"Rome wasn\'t built in a day". Hãy nghỉ ngơi một chút, nghe một bài nhạc tiếng Anh yêu thích rồi quay lại chiến đấu tiếp! Tobi luôn ủng hộ bạn! 💪❤️';
        }

        // Target Score
        if (msg.match(/(điểm|score|target|mục tiêu|450|600|800)/)) {
            return 'Mục tiêu là động lực lớn nhất! 🎯\n\nĐể đạt target của mình, bạn hãy chia nhỏ lộ trình ra nhé. Ví dụ muốn tăng 100 điểm thì cần ôn tập trung khoảng 1 tháng. Bạn đã set target trong profile chưa?';
        }

        // Pricing/Upgrade (Mock)
        if (msg.match(/(phí|tiền|mua|nâng cấp|vip|pro)/)) {
            return 'Hiện tại Tobi hoàn toàn miễn phí để hỗ trợ bạn học tập! 🥰 Hãy tận dụng hết các tính năng nhé!';
        }

        // Personal/Fun
        if (msg.match(/(tên gì|bạn là ai|tuổi|sinh nhật|ny|người yêu)/)) {
            return 'Mình là Tobi, trợ lý AI siêu cấp vip pro của bạn đây! 🤖✨\nMình "sinh" năm 2026, chưa có người yêu nhưng có hàng nghìn bạn học viên dễ thương giống như bạn nè!';
        }

        // Default response
        return 'Tôi hiểu rồi! Tôi đang học hỏi thêm để trả lời bạn tốt hơn. Hiện tại, bạn có thể hỏi tôi về từ vựng, bài tập, hoặc cần động viên trong quá trình học nhé! 🤖💙';
    }
}
