package com.pkyingyu.mp.common.utils;

import java.util.Arrays;
import java.util.List;

// 过滤和检查敏感词汇
public class UtilTextFilter {
    private static List<String> sensitiveWords = Arrays.asList(
            "bitch", "bastard", "nigger", "faggot", "chink", "spic",
            "fuck", "ass", "shit", "porn", "boobs", "penis",
            "scam", "fraud", "cheat", "swindle",
            "kill", "murder", "hit", "shoot",
            "loser", "idiot", "stupid", "moron", "retard", "ugly",
            "婊子", "混蛋", "黑鬼", "同性恋", "华人蔑称", "西班牙裔蔑称",
            "操你妈", "屁股", "狗屎", "色情", "乳房", "阴茎",
            "诈骗", "欺诈", "骗子", "诈骗",
            "杀死", "谋杀", "打击", "射击",
            "失败者", "白痴", "愚蠢的", "傻瓜", "弱智", "丑陋的"
    );

    public static String filter(String text) {
        String[] words = text.split("\\s+");
        StringBuilder filteredText = new StringBuilder();
        for (String word : words) {
            if (sensitiveWords.contains(word.toLowerCase())) {
                filteredText.append("***");
            } else {
                filteredText.append(word);
            }
            filteredText.append(" ");
        }
        return filteredText.toString().trim();
    }

    public static boolean isOk(String text) {
        String[] words = text.split("\\s+");
        for (String word : words) {
            if (sensitiveWords.contains(word.toLowerCase())) {
                return false;
            }
        }
        return true;
    }
}
