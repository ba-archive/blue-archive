import os
import momotalk_pb2
import json

def main():

    momotalkData = momotalk_pb2.MomotalkData()

    dict = {}
    with open("./test.json", "r", encoding="UTF-8") as f:
        dict = json.loads(f.read())

    for item in dict["DataList"]:
        momotalkItem = momotalkData.DataList.add()
        momotalkItem.MessageGroupId = item["MessageGroupId"]
        momotalkItem.Id = item["MessageGroupId"]
        momotalkItem.CharacterId = item["CharacterId"]
        condition = item["MessageCondition"]
        momotalkItem.MessageCondition = momotalk_pb2.MessageCondition.NoneB
        if condition == "FavorRankUp":
            momotalkItem.MessageCondition = momotalk_pb2.MessageCondition.FavorRankUp
        if condition == "Answer":
            momotalkItem.MessageCondition = momotalk_pb2.MessageCondition.Answer
        if condition == "Feedback":
            momotalkItem.MessageCondition = momotalk_pb2.MessageCondition.Feedback
        momotalkItem.ConditionValue = item["ConditionValue"]
        momotalkItem.PreConditionGroupId = item["PreConditionGroupId"]
        momotalkItem.PreConditionFavorScheduleId = item["PreConditionFavorScheduleId"]
        momotalkItem.FavorScheduleId = item["FavorScheduleId"]
        momotalkItem.NextGroupId = item["NextGroupId"]
        momotalkItem.FeedbackTimeMillisec = item["FeedbackTimeMillisec"]
        messageType = item["MessageType"]
        momotalkItem.MessageType = momotalk_pb2.MessageType.NoneA
        if messageType == "FavorRankUp":
            momotalkItem.MessageType = momotalk_pb2.MessageType.Text
        if messageType == "Answer":
            momotalkItem.MessageType = momotalk_pb2.MessageType.Image
        momotalkItem.ImagePath = item["ImagePath"]
        momotalkItem.MessageKR = item["MessageKR"]
        momotalkItem.MessageJP = item["MessageJP"]
    str = momotalkData.SerializeToString()
    with open("./save", "wb", encoding="UTF-8") as f:
        f.write(str)

if __name__ == "__main__":
    main()