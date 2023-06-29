let currentStatus = 'off';

function updateStatus() {
  currentStatus = currentStatus === 'on' ? 'off' : 'on';
  return {
    status: currentStatus,
  };
}

module.exports = { updateStatus };
