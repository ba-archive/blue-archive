import json

def main():

    dict = {}
    list = []
    with open("./test.json", "r", encoding="UTF-8") as f:
        dict = json.loads(f.read())

    for item in dict["DataList"]:
        MessageGroupId = item["MessageGroupId"]
        Id = item["MessageGroupId"]
        CharacterId = item["CharacterId"]
        MessageCondition = item["MessageCondition"]
        ConditionValue = item["ConditionValue"]
        PreConditionGroupId = item["PreConditionGroupId"]
        PreConditionFavorScheduleId = item["PreConditionFavorScheduleId"]
        FavorScheduleId = item["FavorScheduleId"]
        NextGroupId = item["NextGroupId"]
        FeedbackTimeMillisec = item["FeedbackTimeMillisec"]
        MessageType = item["MessageType"]
        ImagePath = item["ImagePath"]
        MessageKR = item["MessageKR"]
        MessageJP = item["MessageJP"]
        str = "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s" % (
            MessageGroupId, Id, CharacterId, MessageCondition, ConditionValue,
            PreConditionGroupId, PreConditionFavorScheduleId, FavorScheduleId,
            NextGroupId, FeedbackTimeMillisec, MessageType, ImagePath, MessageKR, MessageJP
        )
        list.append(str)
    with open("./savecsv", "w", encoding="UTF-8") as f:
        f.write("\n".join(list))

if __name__ == "__main__":
    main()