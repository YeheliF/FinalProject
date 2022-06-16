import sys

import torch
import torchvision
import torch.nn as nn
import torchvision.datasets as datasets
import torch.nn.functional as F
import torch.optim as optim
import numpy as np
from matplotlib import pyplot as plt
from torch.utils.data import TensorDataset
import torch.utils.data as data_utils
import pandas as pd
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score

INPUT_SIZE = 44


class ModuleFinal(nn.Module):

    # initialize layers here
    def __init__(self, image_size):
        super(ModuleFinal, self).__init__()
        self.image_size = image_size
        self.fc0 = nn.Linear(image_size, 1024)
        self.fc1 = nn.Linear(1024, 1024)
        self.fc2 = nn.Linear(1024, 256)
        self.fc3 = nn.Linear(256, 4)

        self.m0 = nn.BatchNorm1d(1024)
        self.m1 = nn.BatchNorm1d(1024)
        self.m2 = nn.BatchNorm1d(256)

        self.leaky = nn.LeakyReLU(0.2)

    # forward step, use activation function for every layer
    def forward(self, x):
        x = self.m0(self.fc0(x))
        x = self.leaky(x)
        x = self.m1(self.fc1(x))
        x = self.leaky(x)
        x = self.m2(self.fc2(x))
        x = self.leaky(x)
        x = self.fc3(x)

        return F.log_softmax(x, dim=1)

# train
def train(train_loader, model, epoch, valid_interval, valid_load, optimizer):
    length = len(train_loader.dataset)
    for i in range(epoch):
        t_loss = 0
        correct = 0
        model.train()
        for batch_idx, (data, target) in enumerate(train_loader):
            optimizer.zero_grad()
            output = model(data)
            loss = F.nll_loss(output, target, reduction='sum')
            t_loss += loss.data
            pred = output.max(1, keepdim=True)[1]  # get index of max log-probabilty
            correct += pred.eq(target.view_as(pred)).cpu().sum()
            loss.backward()
            optimizer.step()
        print('Train, Epoch[{}/{}]: Avg loss: {:.4f}, accuracy: {}/{} ({:.0f}%)'.
              format(i + 1, epoch, t_loss / length, correct, length, 100. * correct / length))
        if (i + 1) % valid_interval == 0:
            valid_check(model, valid_load, i + 1, epoch)

    return model



def valid_check(model, test_load, ep, total):
    length = len(test_load.dataset)
    model.eval()
    test_loss = 0
    correct = 0
    y_pred = []
    y_true = []
    with torch.no_grad():
        for data, target in test_load:
            output = model(data)
            test_loss += F.nll_loss(output, target, reduction='sum').item() #sum up batch loss ,  size_average=False
            pred = output.max(1, keepdim=True)[1] # get index of max log-probabilty
            correct += pred.eq(target.view_as(pred)).cpu().sum()
            y_pred.append(pred[0].item())
            y_true.append(target[0].item())
    test_loss /= len(test_load.dataset)
    print('\nValid, Epoch[{}/{}]: Avg loss: {:.4f}, accuracy: {}/{} ({:.0f}%)\n'.
          format(ep, total, test_loss, correct, length, 100. * correct / length))
    precision1 = precision_score(y_true, y_pred, average='micro')
    precision2 = precision_score(y_true, y_pred, average='macro')
    precision3 = precision_score(y_true, y_pred, average='weighted')
    precision4 = precision_score(y_true, y_pred, average=None, zero_division=1)
    print('         Prescision : micro precision={:.2f}. macro precision={:.2f}. weighted precision={:.2f}'.format(precision1, precision2, precision3))
    print('         Prescision : class0={:.2f}. class1={:.2f}. class2={:.2f}. class3={:.2f}\n'.format(precision4[0], precision4[1], precision4[2], precision4[3]))
    recall1 = recall_score(y_true, y_pred, average='micro')
    recall2 = recall_score(y_true, y_pred, average='macro')
    recall3 = recall_score(y_true, y_pred, average='weighted')
    recall4 = recall_score(y_true, y_pred, average=None, zero_division=1)
    print('         Recall : micro recall={:.2f}. macro recall={:.2f}. weighted recall={:.2f}'.format(recall1, recall2, recall3))
    print('         Recall : class0={:.2f}. class1={:.2f}. class2={:.2f}. class3={:.2f}\n'.format(recall4[0], recall4[1], recall4[2], recall4[3]))
    f11 = f1_score(y_true, y_pred, average='micro')
    f12 = f1_score(y_true, y_pred, average='macro')
    f13 = f1_score(y_true, y_pred, average='weighted')
    f14 = f1_score(y_true, y_pred, average=None, zero_division=1)
    print('         F1 score : micro f1={:.2f}. macro f1={:.2f}. weighted f1={:.2f}'.format(f11, f12, f13))
    print('         F1 score : class0={:.2f}. class1={:.2f}. class2={:.2f}. class3={:.2f}\n'.format(f14[0], f14[1], f14[2], f14[3]))
    




def run_train(file_name, save_path):
    flights = pd.read_excel(file_name)
    l_flights = len(flights)
    len_ratio = round(l_flights * 0.90) + 1
    ratio = [len_ratio, l_flights - len_ratio]
    train_load, valid_load = torch.utils.data.random_split(list(zip(flights.drop('delay_class', axis = 1).values.astype(np.float32),
                                                                    flights['delay_class'].values.astype(np.float32))), ratio)

    train_x = [train_load[i][0] for i in range(len(train_load))]
    train_y = [train_load[i][1] for i in range(len(train_load))]

    train_tensor = data_utils.TensorDataset(torch.from_numpy(np.array(train_x)).float(), torch.from_numpy(np.array(train_y)).long())
    train_loader = data_utils.DataLoader(dataset = train_tensor, batch_size = 64, shuffle = True)

    valid_x = [train_load[i][0] for i in range(len(valid_load))]
    valid_y = [train_load[i][1] for i in range(len(valid_load))]

    valid_tensor = data_utils.TensorDataset(torch.from_numpy(np.array(valid_x)).float(), torch.from_numpy(np.array(valid_y)).long())
    valid_loader = data_utils.DataLoader(dataset = valid_tensor, batch_size = 1, shuffle = False)

    # module to train
    model = ModuleFinal(image_size=44)

    # learning rate
    lr = 0.0001

    # epochs
    epoch = 180

    # optimizer
    optimizer = optim.Adam(model.parameters(), lr=lr)
    model = train(train_loader, model, epoch, 5, valid_loader, optimizer)

    # saving the model
    torch.save(model.state_dict(), save_path)

def model_eval(save_path, input):
    model = ModuleFinal(image_size=INPUT_SIZE)
    model.load_state_dict(torch.load(save_path))
    model.eval()
    output = 0
    with torch.no_grad():
        for data, target in input:
            print(target[0][0].item())
            output = model(data)
    pred = output.max(1, keepdim=True)[1]
    return pred

if __name__ == "__main__":
    run_train(sys.argv[1], sys.argv[2])
    # arr = [[-0.37, -0.92, -0.5, -0.866, 0.978, -0.207, 0.309, -0.95, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0]]
    # valid_tensor = data_utils.TensorDataset(torch.from_numpy(np.array(arr)).float(), torch.from_numpy(np.array([[1]])).long())
    # valid_loader = data_utils.DataLoader(dataset = valid_tensor, batch_size = 1, shuffle = False)
    # print(model_eval(sys.argv[1], valid_loader)[0][0])