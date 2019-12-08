const messages = {
  process_csv: 'The csv will be processed background.',
  saved: 'Successfully Saved!',
  created: 'Successfully Saved!',
  deleted: 'Successfully Removed',
  updated: 'Successfully updated'
}

export default function getMsgText(handle) {
  return messages[handle]
}
