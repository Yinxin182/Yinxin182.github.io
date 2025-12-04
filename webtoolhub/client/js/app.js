// 串口工具功能
document.addEventListener('DOMContentLoaded', () => {
  // 初始化Socket.IO连接
  const socket = io('http://localhost:3000');
  
  // 获取可用串口
  fetch('/api/serial/ports')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const portSelect = document.getElementById('serial-port');
        data.data.forEach(port => {
          const option = document.createElement('option');
          option.value = port.path;
          option.textContent = `${port.path} - ${port.manufacturer || '未知设备'}`;
          portSelect.appendChild(option);
        });
      }
    });
  
  // 串口连接按钮
  document.getElementById('serial-connect').addEventListener('click', function() {
    if (this.textContent.includes('连接')) {
      const port = document.getElementById('serial-port').value;
      const baudrate = document.getElementById('serial-baudrate').value;
      
      // 通过Socket.IO连接串口
      socket.emit('serial-connect', { port, baudrate });
      
      fetch('/api/serial/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          port,
          baudRate: baudrate,
          dataBits: document.getElementById('serial-databits').value,
          stopBits: document.getElementById('serial-stopbits').value,
          parity: document.getElementById('serial-parity').value
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          updateTerminal(`已连接到 ${port}`, 'success');
          this.innerHTML = '<i class="fa fa-disconnect mr-2"></i>断开';
          this.classList.remove('bg-primary');
          this.classList.add('bg-danger');
        }
      });
    } else {
      // 断开连接
      this.innerHTML = '<i class="fa fa-connectdevelop mr-2"></i>连接';
      this.classList.remove('bg-danger');
      this.classList.add('bg-primary');
      updateTerminal('已断开连接', 'warning');
    }
  });
  
  // 发送数据
  document.getElementById('send-data').addEventListener('click', function() {
    const input = document.getElementById('terminal-input');
    const port = document.getElementById('serial-port').value;
    
    if (input.value.trim()) {
      // 通过Socket.IO发送数据
      socket.emit('serial-send', input.value);
      
      // 记录发送的数据
      updateTerminal(`> ${input.value}`, 'primary');
      
      // 通过API发送数据
      fetch('/api/serial/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port, data: input.value })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          updateTerminal(`< ${data.data.received}`, 'secondary');
        }
      });
      
      input.value = '';
    }
  });
  
  // 监听串口响应
  socket.on('serial-receive', (data) => {
    updateTerminal(`< ${data.data}`, 'secondary');
  });
  
  // 更新终端显示
  function updateTerminal(message, type) {
    const output = document.getElementById('terminal-output');
    const timestamp = new Date().toLocaleString();
    const className = type === 'success' ? 'text-success' : 
                      type === 'warning' ? 'text-warning' : 
                      type === 'primary' ? 'text-primary' : 'text-secondary';
    
    output.innerHTML += `<div class="${className}">[${timestamp}] ${message}</div>`;
    output.scrollTop = output.scrollHeight;
  }
  
  // 加载统计数据
  fetch('/api/stats/system')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 更新统计图表
        updateStatsChart(data.data.userGrowth, data.data.orderGrowth);
      }
    });
  
  // 加载最近订单
  fetch('/api/stats/orders')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        updateOrderTable(data.data);
      }
    });
  
  // 贪吃蛇游戏保存分数
  window.saveSnakeScore = function(score) {
    fetch('/api/games/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameType: 'snake',
        score: score,
        username: '玩家' + Math.floor(Math.random() * 1000)
      })
    });
  };
});

// 更新统计图表
function updateStatsChart(userData, orderData) {
  const ctx = document.getElementById('stats-chart').getContext('2d');
  
  // 如果已有图表实例，先销毁
  if (window.statsChartInstance) {
    window.statsChartInstance.destroy();
  }
  
  window.statsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '用户增长',
          data: userData,
          borderColor: '#165DFF',
          backgroundColor: 'rgba(22, 93, 255, 0.1)',
          fill: true
        },
        {
          label: '订单增长',
          data: orderData,
          borderColor: '#F53F3F',
          backgroundColor: 'rgba(245, 63, 63, 0.1)',
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// 更新订单表格
function updateOrderTable(orders) {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';
  
  orders.forEach(order => {
    const statusClass = order.status === 'completed' ? 'bg-success/10 text-success' :
                        order.status === 'processing' ? 'bg-warning/10 text-warning' :
                        'bg-danger/10 text-danger';
    
    const statusText = order.status === 'completed' ? '已完成' :
                       order.status === 'processing' ? '处理中' : '已取消';
    
    const row = `
      <tr>
        <td class="px-4 py-3 whitespace-nowrap text-sm">${order.id}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm">${order.customer}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm">¥${order.amount}</td>
        <td class="px-4 py-3 whitespace-nowrap">
          <span class="px-2 py-1 text-xs rounded-full ${statusClass}">${statusText}</span>
        </td>
      </tr>
    `;
    
    tableBody.innerHTML += row;
  });
}