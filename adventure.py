# 收到用户两个人名，生成一个故事返回
import sys
import random
import io
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

content = sys.argv[1]
# 下边这条是从node接到的content例子，把上面comment掉测试用（部署之前记得改回去）
# content = '<p><span class="h-card"><a href="https://bgme.me/@ciao" class="u-url mention">@<span>ciao</span></a></span> 奇遇</p><p>p<br />a</p>'

# 拆出最后两行的文本，返回


def split_content(text):
    my_string = text[108:]
    my_string = my_string[:-4]
    # print(my_string)
    i = len(my_string)
    flag2 = 0
    flag3 = 0
    flag4 = 0
    while i != 0:
        i -= 1
        if my_string[i] == '>':
            if flag4 == 0:
                flag4 = i
            else:
                flag2 = i
                break
        if my_string[i] == '<':
            flag3 = i

    if flag2 != 0 and flag3 != 0 and flag4 != 0:
        person1 = my_string[flag2+1:flag3]
        person2 = my_string[flag4+1:]
        return(person1, person2)
    else:
        return("A", "B")


# '','','','','','','','',
career_list = [ #学校
                '高中生', '大学生', '研究生兼职辅导员', '老师', '班长', '体育生', '物理学家', '生物学家',
                #工作
                '社畜', '模特', '电竞选手', '干净又卫生主播', '美妆博主', '魔术师', '潜水员', '实习生', '花店店员', '厨师', '歌手', '演员', '片警', '程序员', '作家', '画师', '摄影师', '牙医', '医生', '兽医', '鱼贩',  '设计师', '乌龟饲养员', '护林员', '飞行员', '公交车司机', '便利店收银员', '婚礼主持人', '商人', '老板', '大副', '记者', '美食家', '保镖', '石油大亨', '基金经理', 'HR', '清洁工', '脱口秀演员', '色情主播', '无业游民', '探险家', '王位继承人', '总裁', '秘书',
                #标签
                '福瑞控', '阿宅', '显卡发烧友', '暴走族', '海底捞拉面大师', '富二代', '棕熊', '俄罗斯人', '工具人',
                #西幻
                '天使', '恶魔', '堕天使', '魅魔', '人鱼', '吸血鬼', '丧尸', '人马', '傲罗', '神父', '祭司', '吟游诗人', '巫师', '海盗', '魔法师', '骑士', '精灵', '神奇动物', '超级英雄', '摸金校尉', '牧马人', '龙', '矮人', '召唤师', '武士', '剑士', '亡灵', '刺客',
                #科幻
                '高达驾驶员', '仿生人', '机器人', '外星人', 
                #传统神话
                '月老', '天师', '狐狸精', '道士', '书生', '笔仙', '仙人'
                ]

adj_list = ['温柔的', '显著帅过正常人的', '暴躁的', '凶残的', '勇敢的',
            '忧心忡忡的', '成熟的', '热爱运动的', '责任心强的', '曾经两次掉进井里的',
            '事业有成的', '非常有钱的', '腿毛很性感的', '爱热闹的',
            '野心勃勃的', '不吃香菜的', '乳糖不耐受的', '不太聪明的', '聪明的',
            '经常面带微笑的', '胸很大的', '忘记吃早饭的', '拥有天籁般嗓音的',
            '酒量很差的', '富有同情心的', '不太会拒绝别人的', '成绩很好的',
            '一杯茶一包烟一篇论文写一天的', '正在犯困的', '随性的', '失忆的',
            '很会做饭的', '不爱看书的', '长出猫耳的', '性欲旺盛的',
            '地球上最后的', '宇宙里唯一的', '人气极高的', '古穿今的', '饥肠辘辘的',
            '一根筋的', '粗心大意的', '有直升飞机驾驶证的', '卧推二百斤的', '善于交际的', '脾气暴躁的',
            '座右铭是不做 free rider 天打雷劈的', '精通C语言的',
            '发自拍从来不P图的', '梦想是成为海贼王的', '一次意外后拥有了替身使者的', '不相信爱的',
            '最喜欢的歌是《阿弥陀佛圣号》的', '每天晚上都会受到克苏鲁召唤的',
            '不知道怎么停止视频网站会员自动续费的', '游手好闲的',
            '多情的', '孤独的', '会说二十八门外语的', '潦倒的', '长出了翅膀的',
            '有神秘超能力的', '摆烂的', '身高185长度18.5的', '很会抬杠的']

# '在', '在', '在', '在', \
position_list = ['在学校', '在家里', '在厕所', '在天坛东路', '躺在床上',
                 '在电梯里', '在飞机上', '在森林里', '在街边的超市', '在演唱会',
                 '在老板的办公室', '在发小的生日聚会上', '在十字路口',
                 '在宇宙飞船里', '在外星', '在花鸟鱼虫市场',
                 '在唐人街', '在施工现场', '在地铁里', '在火车站', '在秋叶原',
                 '在自习室', '在加油站', '在河边', '在海边', '在饭馆', '在肯德基',
                 '在旅馆', '在水族馆', '在动物园', '在办公室', '在医院',
                 '在副本里', '在香菜组成的森林里', '在印度街头', '在厨房里', '蹲在树上',
                 '在教堂', '在墓地', '在经常和ex约会的咖啡厅', '在公园长椅', '在电影院', '在火山口',
                 '在夏威夷某颗棕榈树下', '在宿舍', '在梦里', '在图书馆',
                 '在烂尾楼', '在废弃医院', '在夜市', '在执行绝密任务的路上', '在凌晨三点', '在大中午', '在酒吧']

# '时', '时', '时', '时', \
event_list = ['写论文时', '吃饭时', '看黄片时', '屠龙时', '猎魔时',
              '撞邪时', '和别人做爱时', '玩手机时', '幻想中了六合彩时',
              '发呆时', '生闷气时', '吃薯片时', '遛狗时',
              '祈祷时', '想烦心事时', '写代码时', '被通知自己竟然怀孕！！！时', '发现钱包丢了时',
              '喝水时', '迷路时', '因为踩到口香糖而火大时',
              '打游戏时', '练武功时', '看书时', '讲笑话时', '学英语时', '思考晚饭吃什么时',
              '喝酒时', '写辞职信时', '喝茶水嗑瓜子看电视时', '试图种菜时', '给猫洗澡时', '创作色情小说时', '直播脱衣舞时', '准备自杀时',
              '试图用鼻子碰到自己的胳膊肘时', '洗裤衩时',
              '泡咖啡时', '遛邻居的狗时', '伸懒腰时', '面试时', '开视频会议时', '给老妈打电话时']

action_list = ['不小心撞倒了', '碰巧遇到了', '竟然重逢了', '顺手调戏了', '一见钟情了', '连哄带骗带走了',
               '分手了', '意外失忆, 竟然忘记了', '决定告白']

# 以下代码保证两人的性格和角色不同
adj1 = random.randint(0, len(adj_list)-1)
while True:
    adj2 = random.randint(0, len(adj_list)-1)
    if adj2 != adj1:
        break
career1 = random.randint(0, len(career_list)-1)
while True:
    career2 = random.randint(0, len(career_list)-1)
    if career2 != career1:
        break
position = random.randint(0, len(position_list)-1)
event = random.randint(0, len(event_list)-1)
action = random.randint(0, len(action_list)-1)

person1, person2 = split_content(content)

return_string = "作为一个" + adj_list[adj1] + career_list[career1] + \
    ", " + person1 + position_list[position] + event_list[event] + \
    ", " + action_list[action] + adj_list[adj2] + \
    career_list[career2] + person2 + "。"

print(return_string)
